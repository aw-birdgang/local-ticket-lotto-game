import { Injectable } from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {WinningTicket} from "../entity/winning-ticket.entity";
import {EntityManager, Repository} from "typeorm";
import {RoundWinningNumberService} from "../../game/service/round-winning-number.service";
import {Ticket} from "../entity/ticket.entity";
import {IssuedTicket} from "../entity/issued-ticket.entity";
import {TicketCurrency} from "../entity/ticket-currency.entity";
import {TicketIssueWinningCurrencyDto} from "../dto/ticket-issue-winning-currency.dto";
import {WinningTicketDetailDto} from "../dto/winning-ticket-detail.dto";
import {isEmpty, isNotEmpty} from "class-validator";
import {FilterSort, SortingType} from "../../common/microservice/from-search-filter";
import {Pagination} from "../../common/microservice/tcp-request";
import {PaginationMeta, TcpPaginationResponse} from "../../common/microservice/tcp-response";
import {PrizeStatus} from "../../finance/entity/finance.enum";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";

@Injectable()
export class WinningTicketService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(WinningTicket) private winningTicketRepository: Repository<WinningTicket>,
        private readonly roundWinningNumberService: RoundWinningNumberService,
    ) {}

    findById(ticketId: string): Promise<WinningTicket> {
        return this.winningTicketRepository.findOneBy({ ticketId });
    }

    private baseQuery() {
        return this.entityManager
            .createQueryBuilder(WinningTicket, "wt")
            .innerJoin(Ticket, "tt", "tt.id = wt.ticket_id")
            .innerJoin(IssuedTicket, "it", "it.ticket_id = wt.ticket_id")
            .innerJoin(TicketCurrency, "tc", "tc.id = tt.ticket_currency_id")
            .select("wt.ticket_id", "ticketId")
            .addSelect("tt.bundle_ticket_id", "bundleTicketId")
            .addSelect("tt.owner_id", "ownerId")
            .addSelect("tt.round_id", "roundId")
            .addSelect("tt.status", "ticketStatus")
            .addSelect("tt.ticket_currency_id", "ticketCurrencyId")
            .addSelect("tc.currency_code", "currencyCode")
            .addSelect("tc.amount", "ticketCurrencyAmount")
            .addSelect("it.issue_date", "issueDate")
            .addSelect("it.ball1", "ball1")
            .addSelect("it.ball2", "ball2")
            .addSelect("it.ball3", "ball3")
            .addSelect("it.ball4", "ball4")
            .addSelect("it.ball5", "ball5")
            .addSelect("it.ball6", "ball6")
            .addSelect("it.expire_date", "expireDate")
            .addSelect("wt.ranking", "ranking")
            .addSelect("wt.claim_date", "claimDate")
            .addSelect("wt.prize_amount", "prizeAmount")
            .addSelect("wt.prize_status", "prizeStatus");
    }

    findTicketIssueWinningCurrencyByTicketId(ticketId: string): Promise<TicketIssueWinningCurrencyDto> {
        const queryBuilder = this.baseQuery();
        queryBuilder.where({ id: ticketId });
        return queryBuilder.getRawOne<TicketIssueWinningCurrencyDto>();
    }

    async findWinningTicketDetailByTicketId(ticketId: string): Promise<WinningTicketDetailDto> {
        const queryBuilder = this.baseQuery();
        queryBuilder.where({ ticketId });
        const ticketIssueWinningCurrencyDto = await queryBuilder.getRawOne<TicketIssueWinningCurrencyDto>();
        if (isEmpty(ticketIssueWinningCurrencyDto)) {
            return null;
        }
        const roundWinningNumberDto = await this.roundWinningNumberService.findByRoundId(ticketIssueWinningCurrencyDto.roundId);
        return WinningTicketDetailDto.from(ticketIssueWinningCurrencyDto, roundWinningNumberDto);
    }

    async findByFilterSort(filterSort: FilterSort, pagination: Pagination): Promise<TcpPaginationResponse<WinningTicketDetailDto[]>> {
        const queryBuilder = this.baseQuery();
        if (isNotEmpty(filterSort.filter["ownerId"])) {
            const ownerId = filterSort.filter["ownerId"];
            queryBuilder.andWhere("wt.owner_id = :ownerId", { ownerId });
        }
        if (isNotEmpty(filterSort.filter["prizeStatus"])) {
            const prizeStatus = String(filterSort.filter["prizeStatus"]);
            if (prizeStatus.toLowerCase() !== "all") {
                queryBuilder.andWhere("wt.prize_status = :prizeStatus", { prizeStatus });
            }
        }
        if (isNotEmpty(filterSort.filter["startDate"]) && isNotEmpty(filterSort.filter["endDate"])) {
            const startDate = filterSort.filter["startDate"];
            const endDate = filterSort.filter["endDate"];
            queryBuilder.andWhere("wt.claim_date BETWEEN :startDate AND :endDate", {
                startDate: new Date(startDate),
                endDate: new Date(endDate + " 23:59:59"),
            });
        }
        if (isNotEmpty(filterSort.sort)) {
            queryBuilder.orderBy(filterSort.sort);
        } else {
            queryBuilder.orderBy({ claimDate: SortingType.DESC });
        }
        const total = await queryBuilder.getCount();
        queryBuilder.offset((pagination.page - 1) * pagination.offset);
        queryBuilder.limit(pagination.offset);
        console.log("query -> ", queryBuilder.getQuery());
        const list = await queryBuilder.getRawMany<TicketIssueWinningCurrencyDto>();
        const ticketWinningDetailDtoList = await Promise.all(
            list.map(async (ticketIssueWinningCurrencyDto) => {
                const roundWinningNumberDto = await this.roundWinningNumberService.findByRoundId(ticketIssueWinningCurrencyDto.roundId);
                return WinningTicketDetailDto.from(ticketIssueWinningCurrencyDto, roundWinningNumberDto);
            }),
        );
        return TcpPaginationResponse.from<WinningTicketDetailDto[]>(
            ticketWinningDetailDtoList,
            PaginationMeta.from(total, pagination.page, Math.ceil(total / pagination.offset)),
        );
    }

    async editPrizeStatusByTicketId(ticketId: string, prizeStatus: PrizeStatus) {
        const winningTicket = await this.findById(ticketId);
        if (isEmpty(winningTicket)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_011);
        }
        const updateResult = await this.winningTicketRepository.update({ ticketId }, { prizeStatus });
        if (isEmpty(updateResult) || updateResult.affected <= 0) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_009);
        }
    }
}
