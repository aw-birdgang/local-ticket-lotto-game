import {Injectable, Logger} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {EntityManager, Repository} from "typeorm";
import {PrizePayout} from "../entity/prize-payout.entity";
import {isEmpty, isNotEmpty} from "class-validator";
import {PrizePayoutDetailDto} from "../dto/prize-payout-detail.dto";
import {booleanify} from "../../common/utils/string-util";
import {FilterSort, SortingType} from "../../common/microservice/from-search-filter";
import {Pagination} from "../../common/microservice/tcp-request";
import {PaginationMeta, TcpPaginationResponse} from "../../common/microservice/tcp-response";
import {WinningTicketDetailDto} from "../../ticket/dto/winning-ticket-detail.dto";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";
import {AssetType, OrderType, PayoutStatus, PrizeStatus, PrizeType} from "../entity/finance.enum";
import {SaveConfirmPayoutDto} from "../dto/save-confirm-payout.dto";
import {PayoutDepositDto} from "../dto/payout-deposit.dto";
import {AssetTransactionService} from "./asset-transaction.service";
import {WinningTicketService} from "../../ticket/service/winning-ticket.service";

@Injectable()
export class PrizePayoutService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(PrizePayout) private prizePayoutRepository: Repository<PrizePayout>,
        private readonly winningTicketService: WinningTicketService,
        private readonly assetTransactionService: AssetTransactionService,
    ) {}

    private readonly logger = new Logger(PrizePayoutService.name);

    findById(id: number) {
        return this.prizePayoutRepository.findOneBy({ id });
    }

    private baseQuery() {
        return this.entityManager
            .createQueryBuilder(PrizePayout, "pp")
            .select("pp.id", "id")
            .addSelect("pp.prize_type", "prizeType")
            .addSelect("pp.request_date", "requestDate")
            .addSelect("pp.ticket_id", "ticketId")
            .addSelect("pp.player_id", "playerId")
            .addSelect("pp.payout_status", "payoutStatus")
            .addSelect("pp.manager_id", "managerId")
            .addSelect("pp.confirm_date", "confirmDate")
            .addSelect("pp.confirm_yn", "confirmYn")
            .addSelect("pp.super_manager_id", "superManagerId")
            .addSelect("pp.payout_date", "payoutDate")
            .addSelect("pp.payout_yn", "payoutYn");
    }

    async findPrizePayoutDetailById(prizeId: number) {
        const queryBuilder = this.baseQuery();
        queryBuilder.where("pp.id = :prizeId", { prizeId });
        const prizePayout = await queryBuilder.getRawOne<PrizePayout>();
        if (isEmpty(prizePayout)) {
            return null;
        }
        const winningTicketDetailDto = await this.winningTicketService.findWinningTicketDetailByTicketId(prizePayout.ticketId);
        return PrizePayoutDetailDto.from(PrizePayout.new(prizePayout).toPrizePayoutDto(), winningTicketDetailDto);
    }

    async createPrizePayout(prizePayout: PrizePayout) {
        const insertResult = await this.prizePayoutRepository.insert(prizePayout);
        if (isEmpty(insertResult) || isEmpty(insertResult.identifiers) || isEmpty(insertResult.identifiers[0])) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_008);
        }
    }

    async findByFilterSort(filterSort: FilterSort, pagination: Pagination): Promise<TcpPaginationResponse<PrizePayoutDetailDto[]>> {
        const queryBuilder = this.baseQuery();
        if (isNotEmpty(filterSort.filter["playerId"])) {
            const playerId = filterSort.filter["playerId"];
            queryBuilder.andWhere("pp.player_id = :playerId", { playerId });
        }
        if (isNotEmpty(filterSort.filter["prizeType"])) {
            const prizeType = String(filterSort.filter["prizeType"]);
            const confirmYn = booleanify(filterSort.filter["confirmYn"]);
            const payoutYn = booleanify(filterSort.filter["payoutYn"]);
            queryBuilder.andWhere("pp.prize_type = :prizeType", { prizeType });
            queryBuilder.andWhere("pp.confirm_yn = :confirmYn", { confirmYn });
            queryBuilder.andWhere("pp.payout_yn = :payoutYn", { payoutYn });
        }
        if (isNotEmpty(filterSort.filter["payoutStatus"])) {
            const payoutStatus = String(filterSort.filter["payoutStatus"]);
            if (payoutStatus.toLowerCase() !== "all") {
                queryBuilder.andWhere("pp.payout_status = :payoutStatus", { payoutStatus });
            }
        }
        if (isNotEmpty(filterSort.filter["startDate"]) && isNotEmpty(filterSort.filter["endDate"])) {
            const startDate = filterSort.filter["startDate"];
            const endDate = filterSort.filter["endDate"];
            queryBuilder.andWhere("pp.request_date BETWEEN :startDate AND :endDate", {
                startDate: new Date(startDate),
                endDate: new Date(endDate + " 23:59:59"),
            });
        }
        if (isEmpty(filterSort.sort)) {
            queryBuilder.orderBy({ requestDate: SortingType.DESC });
        } else {
            queryBuilder.orderBy(filterSort.sort);
        }

        const total = await queryBuilder.getCount();
        queryBuilder.offset((pagination.page - 1) * pagination.offset);
        queryBuilder.limit(pagination.offset);

        this.logger.log("query -> ", queryBuilder.getQuery());
        const list = await queryBuilder.getRawMany<PrizePayout>();
        const prizePayoutDetailDtoList = await Promise.all(
            list.map(async (prizePayout) => {
                const winningTicketDetailDto = await this.winningTicketService.findWinningTicketDetailByTicketId(prizePayout.ticketId);
                return PrizePayoutDetailDto.from(PrizePayout.new(prizePayout).toPrizePayoutDto(), winningTicketDetailDto);
            }),
        );

        return TcpPaginationResponse.from<PrizePayoutDetailDto[]>(
            prizePayoutDetailDtoList,
            PaginationMeta.from(total, pagination.page, Math.ceil(total / pagination.offset)),
        );
    }

    async requestPrizeClaimable(ticketId: string): Promise<WinningTicketDetailDto> {
        const winningTicket = await this.winningTicketService.findById(ticketId);
        if (isEmpty(winningTicket)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_011);
        }
        const prizeType = [1, 2, 3].includes(winningTicket.ranking) ? PrizeType.BIG_PRIZE : PrizeType.SMALL_PRIZE;
        const prizePayout = PrizePayout.from(
            null,
            prizeType,
            new Date(),
            winningTicket.ticketId,
            winningTicket.ownerId,
            PayoutStatus.WAITING,
            0,
            null,
            false,
            0,
            null,
            false,
        );
        await this.createPrizePayout(prizePayout);
        await this.winningTicketService.editPrizeStatusByTicketId(ticketId, PrizeStatus.WAITING);

        return this.winningTicketService.findWinningTicketDetailByTicketId(ticketId);
    }

    async confirmPayout(saveConfirmPayoutDto: SaveConfirmPayoutDto) {
        const ids = saveConfirmPayoutDto.prizePayoutIds;
        const prizePayoutDetailList = await Promise.all(
            ids.map(async (id) => {
                const prizePayout = await this.findById(id);
                if (isEmpty(prizePayout)) {
                    throw new BusinessRpcException(ErrorCodes.BUS_ERROR_011);
                }
                const winningTicket = await this.winningTicketService.findById(prizePayout.ticketId);
                if (isEmpty(winningTicket)) {
                    throw new BusinessRpcException(ErrorCodes.BUS_ERROR_011);
                }

                const currentDate = new Date();
                if (saveConfirmPayoutDto.prizeType === PrizeType.SMALL_PRIZE) {
                    await this.prizePayoutRepository.update(
                        { id },
                        {
                            managerId: saveConfirmPayoutDto.managerId,
                            confirmDate: currentDate,
                            confirmYn: true,
                            superManagerId: saveConfirmPayoutDto.superManagerId,
                            payoutDate: currentDate,
                            payoutYn: true,
                        },
                    );
                    await this.assetTransactionService.prizePayout(
                        PayoutDepositDto.from(
                            prizePayout.playerId,
                            AssetType.USD,
                            winningTicket.prizeAmount,
                            OrderType.PRIZE_PAYOUT,
                            String(prizePayout.id),
                        ),
                    );
                } else {
                    if (isEmpty(saveConfirmPayoutDto.superManagerId)) {
                        await this.prizePayoutRepository.update(
                            { id },
                            {
                                managerId: saveConfirmPayoutDto.managerId,
                                confirmDate: currentDate,
                                confirmYn: true,
                            },
                        );
                    } else {
                        await this.prizePayoutRepository.update(
                            { id },
                            {
                                superManagerId: saveConfirmPayoutDto.superManagerId,
                                payoutDate: currentDate,
                                payoutYn: true,
                            },
                        );
                        await this.assetTransactionService.prizePayout(
                            PayoutDepositDto.from(
                                prizePayout.playerId,
                                AssetType.USD,
                                winningTicket.prizeAmount,
                                OrderType.PRIZE_PAYOUT,
                                String(prizePayout.id),
                            ),
                        );
                    }
                }
                return await this.findPrizePayoutDetailById(prizePayout.id);
            }),
        );
        return prizePayoutDetailList;
    }
}
