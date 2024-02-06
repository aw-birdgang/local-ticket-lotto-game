import {Injectable} from '@nestjs/common';
import {BundleTicket} from "../entity/bundle-ticket.entity";
import {EntityManager, Repository} from "typeorm";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {TicketService} from "./ticket.service";
import {TicketCurrencyService} from "./ticket-currency.service";
import {Pagination, TcpPaginationRequest} from "../../common/microservice/tcp-request";
import {PaginationMeta, TcpPaginationResponse} from "../../common/microservice/tcp-response";
import {BundleTicketDto} from "../dto/bundle-ticket.dto";
import {RoundService} from "../../game/service/round.service";
import {BundleTicketDetailsDto} from "../dto/bundle-ticket-details.dto";
import {isEmpty, isNotEmpty} from "class-validator";
import {AssetTransactionService} from "../../finance/service/asset-transaction.service";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";
import {CreateIssuingTicketDto} from "../dto/create-issuing-ticket.dto";
import {randomText} from "../../common/utils/string-util";
import {BuyTicketDto} from "../../finance/dto/buy-ticket.dto";
import {AssetType, OrderType} from "../../finance/entity/finance.enum";
import {FilterSort, SortingType} from "../../common/microservice/from-search-filter";
import {PurchaseTicketListDto} from "../dto/purchase-ticket-list.dto";
import {Ticket} from "../entity/ticket.entity";
import {IssuedTicket} from "../entity/issued-ticket.entity";
import {Round} from "../../game/entity/round.entity";

@Injectable()
export class BundleTicketService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(BundleTicket) private bundleTicketRepository: Repository<BundleTicket>,
        private readonly ticketService: TicketService,
        private readonly roundService: RoundService,
        private readonly ticketCurrencyService: TicketCurrencyService,
        private readonly assetTransactionService: AssetTransactionService,
    ) {}

    findBundleTicketById(id: string): Promise<BundleTicket> {
        return this.bundleTicketRepository.findOneBy({ id });
    }

    findFilteredBundleTicketById(id: string, orderDate?: string): Promise<BundleTicket> {
        return this.bundleTicketRepository.createQueryBuilder().select().where("id = :id", { id: id }).orderBy("purchase_date", "ASC").getOne();
    }

    async findBundleTicketPaginationByOwnerId(request: TcpPaginationRequest<number>): Promise<TcpPaginationResponse<BundleTicketDto[]>> {
        const [bundleTicketList, total] = await this.bundleTicketRepository.findAndCount({
            where: { ownerId: request.data[0].filter.ownerId },
            order: { purchaseDate: request.data[0].sort.transactionDate },
            take: request.pagination.offset,
            skip: (request.pagination.page - 1) * request.pagination.offset,
        });

        const bundleTicketDtoList = await Promise.all(bundleTicketList.map(async (bundleTicket) => bundleTicket.toBundleTicketDto()));
        return TcpPaginationResponse.from<BundleTicketDto[]>(
            bundleTicketDtoList,
            PaginationMeta.from(total, request.pagination.page, Math.ceil(total / request.pagination.offset)),
        );
    }

    async findBundleTicketDetailByBundleTicketId(bundleTicketId: string): Promise<BundleTicketDetailsDto> {
        const bundleTicket = await this.findBundleTicketById(bundleTicketId);
        if (isEmpty(bundleTicket)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_011);
        }
        const ticketDetailList = await this.ticketService.findTicketDetailListByBundleTicketId(bundleTicket.id);
        return BundleTicketDetailsDto.from(bundleTicket.toBundleTicketDto(), ticketDetailList);
    }

    async createBundleTicket(bundleTicket: BundleTicket): Promise<BundleTicket> {
        return this.bundleTicketRepository.save(bundleTicket);
    }

    async createBundleIssuedTicket(issuingTickets: CreateIssuingTicketDto[]): Promise<BundleTicketDetailsDto> {
        const bundleTicketId = randomText(50);

        const ticketCurrency = await this.ticketCurrencyService.findById(1);
        const ticketQuantity = issuingTickets.length;
        const ticketAmount = ticketCurrency.amount * ticketQuantity;
        const bundleTicket = BundleTicket.from(bundleTicketId, issuingTickets[0].ownerId, new Date(), ticketQuantity, ticketAmount);

        // 포인트 차감
        await this.assetTransactionService.buyTicket(
            BuyTicketDto.from(bundleTicket.ownerId, AssetType.USD, ticketAmount, OrderType.TICKET, bundleTicket.id),
        );

        const bundleTicketResult = await this.createBundleTicket(bundleTicket);

        issuingTickets = issuingTickets.map((v) => {
            return { ...v, purchaseDate: bundleTicketResult.purchaseDate };
        });

        await Promise.all(
            issuingTickets.map(async (v, i) => {
                await this.ticketService.createIssuedTicket(issuingTickets[i], bundleTicketId);
            }),
        );

        return this.findBundleTicketDetailByBundleTicketId(bundleTicketId);
    }

    async findPurchaseBundleTicketList(
        filterSort: FilterSort,
        pagination: Pagination,
    ): Promise<TcpPaginationResponse<PurchaseTicketListDto[]>> {
        const combinedQuery = this.entityManager
            .createQueryBuilder(BundleTicket, "bt")
            .leftJoinAndSelect(Ticket, "t", "t.bundle_ticket_id = bt.id")
            .leftJoinAndSelect(IssuedTicket, "it", "it.ticket_id = t.id")
            .leftJoinAndSelect(Round, "ro", "ro.id = it.round_id")
            .select([
                "bt.id AS bundleTicketId",
                "bt.purchase_date AS purchaseDate",
                "bt.ticket_amount AS amount",
                "bt.ticket_quantity AS quantity",
                "GROUP_CONCAT(t.status, ',', ro.turn_number, ',', ro.draw_end_date, ',', ro.id) AS ticketData",
            ])
            .where("bt.owner_id = :ownerId", { ownerId: filterSort.filter.ownerId })
            .groupBy("bt.id");

        if (isNotEmpty(filterSort.filter["startDate"]) && isNotEmpty(filterSort.filter["endDate"])) {
            const startDate = filterSort.filter["startDate"];
            const endDate = filterSort.filter["endDate"];
            combinedQuery.andWhere("bt.purchase_date BETWEEN :startDate AND :endDate", {
                startDate: new Date(startDate),
                endDate: new Date(endDate + " 23:59:59"),
            });
        }

        if (isNotEmpty(filterSort.filter["transactionType"])) {
            const transactionType = filterSort.filter["transactionType"];
            if (!transactionType.includes("all")) {
                combinedQuery.andWhere("t.status = :status", { status: transactionType });
            }
        }

        if (isNotEmpty(filterSort.sort)) {
            combinedQuery.orderBy("bt.purchase_date", filterSort.sort.transactionDate);
        } else {
            combinedQuery.orderBy("bt.purchase_date", SortingType.DESC);
        }

        const total = await combinedQuery.getCount();

        combinedQuery.offset((pagination.page - 1) * pagination.offset).limit(pagination.offset);

        const results = await combinedQuery.getRawMany();

        const formattedResults = results.map((item) => {
            const ticketDataArray = [];
            const ticketDataRaw = item.ticketData.split(",");

            for (let i = 0; i < ticketDataRaw.length; i += 4) {
                ticketDataArray.push({
                    status: ticketDataRaw[i],
                    drawNumber: ticketDataRaw[i + 1],
                    drawDate: ticketDataRaw[i + 2],
                    roundId: ticketDataRaw[i + 3],
                });
            }

            return { ...item, ticketData: ticketDataArray };
        });
        return TcpPaginationResponse.from<PurchaseTicketListDto[]>(
            formattedResults,
            PaginationMeta.from(total, pagination.page, Math.ceil(total / pagination.offset)),
        );
    }

    async findBundleTicketDetailById(bundleTicketId: string): Promise<BundleTicketDetailsDto> {
        const bundleTicket = await this.findBundleTicketById(bundleTicketId);

        if (isEmpty(bundleTicket)) {
            return null;
        }
        const ticketDetailList = await this.ticketService.findTicketDetailListByBundleTicketId(bundleTicket.id);
        const roundId = ticketDetailList[0].ticketDto.roundId;
        const roundInfo = await this.roundService.findById(roundId);

        return BundleTicketDetailsDto.from(bundleTicket.toBundleTicketDto(), ticketDetailList, roundInfo);
    }

}
