import {Injectable} from '@nestjs/common';
import {Brackets, EntityManager, Repository} from "typeorm";
import {Ticket} from "../entity/ticket.entity";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {IssuedTicket} from "../entity/issued-ticket.entity";
import {WinningTicket} from "../entity/winning-ticket.entity";
import {isEmpty, isNotEmpty} from "class-validator";
import {RoundService} from "../../game/service/round.service";
import {TicketCurrencyService} from "./ticket-currency.service";
import {TicketDetailsDto} from "../dto/ticket-deteils.dto";
import {TicketStatus} from "../entity/ticket.enum";
import {randomText} from "../../common/utils/string-util";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";
import {CreateIssuingTicketDto} from "../dto/create-issuing-ticket.dto";
import {Pagination, TcpPaginationRequest, TcpRequest} from "../../common/microservice/tcp-request";
import {PaginationMeta, TcpPaginationResponse} from "../../common/microservice/tcp-response";
import {FilterSort, SearchFilterSort, SortingType} from "../../common/microservice/from-search-filter";
import {Round} from "../../game/entity/round.entity";
import {TotalTicketListDto} from "../dto/total-ticket-list.dto";
import {WinningNumber} from "../../game/entity/winning-number.entity";
import {TicketTransactionDto} from "../dto/ticket-transaction-dto";
import {AssetTransaction} from "../../finance/entity/asset-transaction.entity";
import {Asset} from "../../finance/entity/asset.entity";
import {BundleTicket} from "../entity/bundle-ticket.entity";

@Injectable()
export class TicketService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
        @InjectRepository(IssuedTicket) private issuedTicketRepository: Repository<IssuedTicket>,
        @InjectRepository(WinningTicket) private winningTicketRepository: Repository<WinningTicket>,
        private readonly roundService: RoundService,
        private readonly ticketCurrencyService: TicketCurrencyService,
    ) {}

    findTicketById(ticketId: string): Promise<Ticket> {
        return this.ticketRepository.findOneBy({ id: ticketId });
    }

    findTicketListByOwnerId(ownerId: number): Promise<Ticket[]> {
        return this.ticketRepository.findBy({ ownerId });
    }

    findIssuedTicketById(ticketId: string): Promise<IssuedTicket> {
        return this.issuedTicketRepository.findOneBy({ ticketId });
    }

    findWinningTicketById(ticketId: string): Promise<WinningTicket> {
        return this.winningTicketRepository.findOneBy({ ticketId });
    }

    findTicketListByBundleTicketId(bundleTicketId: string): Promise<Ticket[]> {
        return this.ticketRepository.findBy({ bundleTicketId });
    }

    findTicketCountByOwnerId(ownerId: number): Promise<number> {
        return this.ticketRepository.countBy({ ownerId });
    }

    findTicketCountByRoundId(roundId: number): Promise<number> {
        return this.ticketRepository.countBy({ roundId });
    }

    async findTicketDetailListByBundleTicketId(bundleTicketId: string) {
        const ticketList = await this.findTicketListByBundleTicketId(bundleTicketId);
        if (isEmpty(ticketList)) {
            return null;
        }
        return Promise.all(
            ticketList.map(async (ticket) => {
                const ticketCurrency = await this.ticketCurrencyService.findById(ticket.ticketCurrencyId);
                const issuedTicket = await this.findIssuedTicketById(ticket.id);
                const winningTicket = await this.findWinningTicketById(ticket.id);
                return TicketDetailsDto.from(
                    ticket.toTicketDto(),
                    isEmpty(ticketCurrency) ? null : ticketCurrency.toTicketCurrencyDto(),
                    isEmpty(issuedTicket) ? null : issuedTicket.toIssuedTicketDto(),
                    isEmpty(winningTicket) ? null : winningTicket.toWinningTicketDto(),
                );
            }),
        );
    }

    async findPurchaseTicketDetailListByBundleTicketId(bundleTicketId: string) {
        const ticketList = await this.findTicketListByBundleTicketId(bundleTicketId);
        if (isEmpty(ticketList)) {
            return null;
        }

        const result = Promise.all(
            ticketList.map(async (ticket) => {
                const ticketCurrency = await this.ticketCurrencyService.findById(ticket.ticketCurrencyId);
                const winningTicket = await this.findWinningTicketById(ticket.id);
                const drawDate = await this.roundService.findById(ticket.roundId);
                return { ticket, ticketCurrency, winningTicket, drawDate };
            }),
        );

        return result;
    }

    async createTicket(
        ownerId: number,
        bundleTiketId: string,
        gameId: number,
        turnNumber: number,
        status: TicketStatus,
        ticketCurrencyId: number,
    ): Promise<Ticket> {
        const round = await this.roundService.findByGameIdAndTurnNumber(gameId, turnNumber);
        if (isEmpty(round)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_002);
        }
        const ticketId = randomText(50);
        return this.ticketRepository.save(Ticket.from(ticketId, bundleTiketId, ownerId, round.id, TicketStatus.ISSUED, ticketCurrencyId));
    }

    async createIssuedTicket(issuingTicket: CreateIssuingTicketDto, bundleTicketId?: string): Promise<TicketDetailsDto> {
        const nowDate = new Date();
        const ticket = await this.createTicket(
            issuingTicket.ownerId,
            bundleTicketId,
            issuingTicket.gameId,
            issuingTicket.turnNumber,
            TicketStatus.ISSUED,
            1,
        );
        if (isEmpty(ticket)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_003);
        }
        const ticketCurrency = await this.ticketCurrencyService.findById(Number(1));
        if (isEmpty(ticketCurrency)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_004);
        }
        const issuedTicket = IssuedTicket.from(
            ticket.id,
            nowDate,
            ticket.roundId,
            issuingTicket.ball1,
            issuingTicket.ball2,
            issuingTicket.ball3,
            issuingTicket.ball4,
            issuingTicket.ball5,
            issuingTicket.ball6,
            nowDate,
        );
        await this.issuedTicketRepository.insert(issuedTicket);
        return TicketDetailsDto.from(ticket.toTicketDto(), ticketCurrency.toTicketCurrencyDto(), issuedTicket.toIssuedTicketDto(), null);
    }

    async findTicketDetailById(ticketId: string): Promise<TicketDetailsDto> {
        console.log("findTicketDetailById  ticketId -> ", ticketId);

        const ticket = await this.findTicketById(ticketId);
        if (isEmpty(ticket)) {
            return null;
        }
        const ticketCurrency = await this.ticketCurrencyService.findById(Number(1));
        const issuedTicket = await this.findIssuedTicketById(ticketId);
        const winningTicket = await this.findWinningTicketById(ticketId);
        return TicketDetailsDto.from(
            ticket.toTicketDto(),
            isEmpty(ticketCurrency) ? null : ticketCurrency.toTicketCurrencyDto(),
            isEmpty(issuedTicket) ? null : issuedTicket.toIssuedTicketDto(),
            isEmpty(winningTicket) ? null : winningTicket.toWinningTicketDto(),
        );
    }

    async findTicketPagination(request: TcpPaginationRequest<number>): Promise<TcpPaginationResponse<Ticket[]>> {
        const [ticketList, total] = await this.ticketRepository.findAndCount({
            where: { ownerId: request.data },
            take: request.pagination.offset,
            skip: (request.pagination.page - 1) * request.pagination.offset,
        });
        return TcpPaginationResponse.from<Ticket[]>(
            ticketList,
            PaginationMeta.from(total, request.pagination.page, Math.ceil(total / request.pagination.offset)),
        );
    }

    async findOngoingTicket(filterSort: FilterSort, pagination: Pagination): Promise<any> {
        const activeRound = await this.roundService.findByActive(1);
        const ticketDataQuery = this.entityManager
            .createQueryBuilder(Ticket, "t")
            .leftJoinAndSelect(IssuedTicket, "it", "it.ticket_id = t.id")
            .leftJoinAndSelect(Round, "ro", "ro.id = t.round_id")
            .select("t.id", "ticketId")
            .addSelect("t.status", "ticketStatus")
            .addSelect("t.bundle_ticket_id", "budndleTicketId")
            .addSelect("ro.id", "roundId")
            .addSelect("ro.draw_end_date", "drawEndDate")
            .addSelect("ro.turn_number", "turnNumber")
            .addSelect("ro.status", "roundStatus")
            .addSelect("it.ball1", "ball1")
            .addSelect("it.ball2", "ball2")
            .addSelect("it.ball3", "ball3")
            .addSelect("it.ball4", "ball4")
            .addSelect("it.ball5", "ball5")
            .addSelect("it.ball6", "ball6")
            .where("t.owner_id = :ownerId", { ownerId: filterSort.filter.ownerId })
            .andWhere("ro.id = :activeRoundId", { activeRoundId: activeRound.id });

        if (isNotEmpty(filterSort.filter["startDate"]) && isNotEmpty(filterSort.filter["endDate"])) {
            const startDate = filterSort.filter["startDate"];
            const endDate = filterSort.filter["endDate"];
            ticketDataQuery.andWhere("bt.purchase_date BETWEEN :startDate AND :endDate", {
                startDate: new Date(startDate),
                endDate: new Date(endDate + " 23:59:59"),
            });
        }

        if (isNotEmpty(filterSort.filter["transactionType"])) {
            const transactionType = filterSort.filter["transactionType"];
            if (!transactionType.includes("all")) {
                ticketDataQuery.andWhere("t.status = :status", { status: transactionType });
            }
        }

        if (isNotEmpty(filterSort.sort)) {
            ticketDataQuery.orderBy("t.created_at", filterSort.sort.transactionDate);
        } else {
            ticketDataQuery.orderBy("t.created_at", SortingType.DESC);
        }
        const total = await ticketDataQuery.getCount();

        ticketDataQuery.offset((pagination.page - 1) * pagination.offset).limit(pagination.offset);

        const result = await ticketDataQuery.getRawMany();

        return TcpPaginationResponse.from<TicketDetailsDto[], PaginationMeta>(
            result,
            PaginationMeta.from(total, pagination.page, Math.ceil(total / pagination.offset)),
        );
    }

    findOngoingTicketCount(ownerId: number) {
        return this.ticketRepository.countBy({ ownerId, status: TicketStatus.ISSUED });
    }

    async findAdminTicketDetailById(ticketId: string): Promise<TicketDetailsDto> {
        const ticket = await this.findTicketById(ticketId);
        if (isEmpty(ticket)) {
            return null;
        }

        const ticketCurrency = await this.ticketCurrencyService.findById(Number(1));
        const issuedTicket = await this.findIssuedTicketById(ticketId);
        const winningTicket = await this.findWinningTicketById(ticketId);
        const roundData = await this.roundService.findById(ticket.roundId);

        return TicketDetailsDto.from(
            ticket.toTicketDto(),
            isEmpty(ticketCurrency) ? null : ticketCurrency.toTicketCurrencyDto(),
            isEmpty(issuedTicket) ? null : issuedTicket.toIssuedTicketDto(),
            isEmpty(winningTicket) ? null : winningTicket.toWinningTicketDto(),
            isEmpty(roundData) ? null : roundData.toRoundDto(),
            null,
        );
    }

    async findAdminTotalTicketList(request: TcpPaginationRequest<SearchFilterSort>): Promise<TcpPaginationResponse<TotalTicketListDto[]>> {
        const requestData = request.data as { [key: string]: any };
        const searchKeywords = requestData.searchKeywords as string | undefined;
        const orderByColumn = requestData.filter.orderByColumn as string | undefined;
        const orderByDirection = requestData.sort.claimDate as ("ASC" | "DESC") | undefined;
        const { offset, page } = request.pagination;

        const query = this.entityManager
            .createQueryBuilder(Ticket, "ticket")
            .innerJoinAndSelect(IssuedTicket, "issued_ticket", "issued_ticket.ticket_id = ticket.id")
            .innerJoinAndSelect(Round, "round", "round.id = ticket.round_id")
            .innerJoinAndSelect(WinningNumber, "winNum", "winNum.round_id = ticket.round_id")
            .select("ticket.id", "id")
            .addSelect("round.start_date", "draw_start_date")
            .addSelect("round.end_date", "draw_end_date")
            .addSelect("round.turn_number", "draw_number")
            .addSelect("issued_ticket.issue_date", "issuance_date")
            .addSelect("user.email", "user_email")
            .addSelect("issued_ticket.ball_1", "draw_number_1")
            .addSelect("issued_ticket.ball_2", "draw_number_2")
            .addSelect("issued_ticket.ball_3", "draw_number_3")
            .addSelect("issued_ticket.ball_4", "draw_number_4")
            .addSelect("issued_ticket.ball_5", "draw_number_5")
            .addSelect("issued_ticket.ball_6", "draw_number_6")
            .addSelect("winNum.ball_1", "winning_number_1")
            .addSelect("winNum.ball_2", "winning_number_2")
            .addSelect("winNum.ball_3", "winning_number_3")
            .addSelect("winNum.ball_4", "winning_number_4")
            .addSelect("winNum.ball_5", "winning_number_5")
            .addSelect("winNum.ball_6", "winning_number_6")
            .addSelect("winNum.ball_bonus", "winning_number_bonus")
            .addSelect("ticket.status", "status");

        if (!!searchKeywords) {
            query.andWhere(
                new Brackets((qb) => {
                    qb.where("ticket.id = :id", { id: searchKeywords }).orWhere("user.email LIKE :email", { email: `%${searchKeywords}%` });
                }),
            );
        }

        if (!!orderByColumn && !!orderByDirection) {
            query.orderBy(orderByColumn, orderByDirection);
        }

        const ticketCountData = await query.getCount();

        const result = await query
            .limit(offset)
            .offset((page - 1) * offset)
            .getRawMany();

        return TcpPaginationResponse.from<TotalTicketListDto[], PaginationMeta>( //any 수정 필요
            result,
            PaginationMeta.from(ticketCountData, page, Math.ceil(ticketCountData / offset)),
        );
    }

    async findTicketTransactionList(request: TcpPaginationRequest<SearchFilterSort>): Promise<TcpPaginationResponse<TicketTransactionDto[]>> {
        const requestData = request.data as { [key: string]: any };
        const searchKeywords = requestData.searchKeywords as string | undefined;
        const orderByColumn = requestData.filter.orderByColumn as string | undefined;
        const orderByDirection = requestData.sort.claimDate as ("ASC" | "DESC") | undefined;
        const { offset, page } = request.pagination;

        const query = this.entityManager
            .createQueryBuilder(AssetTransaction, "at")
            .innerJoinAndSelect(Asset, "asset", "asset.id = at.asset_id")
            .select("at.id", "transactionId")
            .addSelect("at.transaction_date", "transactionDate")
            .addSelect("at.transaction_type", "transactionType")
            .addSelect("at.order_id", "orderNumber")
            .addSelect("user.username", "player")
            .where("at.order_type = :type", { type: "ticket" });

        if (!!searchKeywords) {
            query.andWhere(
                new Brackets((qb) => {
                    qb.where("at.order_id = :order_id", { order_id: searchKeywords }).orWhere("user.username LIKE :username", {
                        username: `%${searchKeywords}%`,
                    });
                }),
            );
        }

        if (!!orderByColumn && !!orderByDirection) {
            query.orderBy(orderByColumn, orderByDirection);
        }

        const listCountData = await query.getCount();

        const result = await query
            .limit(offset)
            .offset((page - 1) * offset)
            .getRawMany();

        return TcpPaginationResponse.from<TicketTransactionDto[], PaginationMeta>(
            result,
            PaginationMeta.from(listCountData, page, Math.ceil(listCountData / offset)),
        );
    }

    async findTicketTransactionDetails(request: TcpRequest<string>): Promise<any> {
        const bundleTicketId = request.data;

        const result = await this.entityManager
            .createQueryBuilder(AssetTransaction, "at")
            .innerJoinAndSelect(BundleTicket, "bt", "bt.id = at.order_id")
            .leftJoin(Ticket, "ticket", "ticket.bundle_ticket_id = at.order_id")
            .select("at.id", "transactionId")
            .addSelect("at.transaction_date", "transactionDate")
            .addSelect("at.transaction_type", "transactionType")
            .addSelect("at.order_type", "orderType")
            .addSelect("at.order_id", "orderNumber")
            .addSelect("user.email", "playerEmail")
            .addSelect((subQuery) => {
                return subQuery
                    .select("GROUP_CONCAT(ticket.id)", "relatedTickets")
                    .from(Ticket, "ticket")
                    .where("ticket.bundle_ticket_id = at.order_id");
            }, "relatedTickets")
            .addSelect((subQuery) => {
                return subQuery.select("COUNT(ticket.id)", "quantity").from(Ticket, "ticket").where("ticket.bundle_ticket_id = at.order_id");
            }, "quantity")
            .addSelect("''", "status")
            .addSelect("'[]'", "timestamps")
            .addSelect("''", "pointTransationHistory")
            .where("at.order_id = :order_id", { order_id: bundleTicketId })
            .groupBy("at.id, at.transaction_date, at.transaction_type, at.order_type, at.order_id, user.email")
            .getRawMany();

        const modifiedResults = result.map((result) => ({
            ...result,
            timestamps: [],
        }));

        return modifiedResults;
    }

}
