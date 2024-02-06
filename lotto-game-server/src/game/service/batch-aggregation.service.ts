import {Injectable, Logger} from '@nestjs/common';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {RoundService} from "./round.service";
import {WinningNumberService} from "./winning-number.service";
import {BatchRoundRanking} from "../entity/batch-round-ranking.entity";
import {BatchJob} from "../entity/batch-job.entity";
import {BatchRoundAggregation} from "../entity/batch-round-aggregation.entity";
import {Round} from "../entity/round.entity";
import {RoundSummaryDto} from "../dto/round-summary.dto";
import {isEmpty} from "class-validator";
import {GameParameter} from "../entity/game.parameter";
import {TcpPaginationRequest} from "../../common/microservice/tcp-request";
import {PaginationMeta, TcpPaginationResponse} from "../../common/microservice/tcp-response";

@Injectable()
export class BatchAggregationService {
    constructor(
        @InjectEntityManager() private entityManager: EntityManager,
        private readonly roundService: RoundService,
        private readonly winningNumberService: WinningNumberService,
    ) {}

    private readonly logger = new Logger(BatchAggregationService.name);

    /**
     * 게임 회차별 당첨랭킹 집계 내역 조회
     */
    findRoundRankingList(roundId: number): Promise<BatchRoundRanking[]> {
        return this.entityManager
            .createQueryBuilder(BatchJob, "bj")
            .innerJoin(BatchRoundRanking, "br", "br.batch_job_id = bj.id")
            .select("br.id", "id")
            .addSelect("br.batch_job_id", "batchJobId")
            .addSelect("br.ranking", "ranking")
            .addSelect("br.total_amount", "totalAmount")
            .addSelect("br.total_quantity", "totalQuantity")
            .addSelect("br.prize_amount_per_ticket", "prizeAmountPerTicket")
            .addSelect("br.payout_prize_amount", "payoutPrizeAmount")
            .addSelect("br.payout_prize_quantity", "payoutPrizeQuantity")
            .addSelect("br.not_payout_prize_amount", "notPayoutPrizeAmount")
            .addSelect("br.not_payout_prize_quantity", "notPayoutPrizeQuantity")
            .orderBy({ ranking: "ASC" })
            .where("bj.round_id = :roundId", { roundId })
            .andWhere(`bj.start_date = (select max(start_date) from batch_job where round_id = bj.round_id)`)
            .getRawMany<BatchRoundRanking>();
    }

    /**
     * 게임 회차별 총 집계 내역 조회
     */
    findRoundAggregation(roundId: number): Promise<BatchRoundAggregation> {
        return this.entityManager
            .createQueryBuilder(BatchJob, "bj")
            .innerJoin(BatchRoundAggregation, "bra", "bra.batch_job_id = bj.id")
            .select("bra.batch_job_id", "batchJobId")
            .addSelect("bra.total_ticket_quantity", "totalTicketQuantity")
            .addSelect("bra.total_ticket_amount", "totalTicketAmount")
            .addSelect("bra.total_prize_amount", "totalPrizeAmount")
            .addSelect("bra.total_donation_amount", "totalDonationAmount")
            .addSelect("bra.total_commission_amount", "totalCommissionAmount")
            .addSelect("bra.total_operating_amount", "totalOperatingAmount")
            .where("bj.round_id = :roundId", { roundId })
            .andWhere(`bj.start_date = (select max(start_date) from batch_job where round_id = bj.round_id)`)
            .getRawOne<BatchRoundAggregation>();
    }

    /**
     * 게임 회차별 요약 정보 조회
     *   - 게임회차정보
     *   - 당첨번호정보
     *   - 회차별 당첨등위별 집계 내역 정보
     *   - 회차별 총집계내역 정보
     */
    async findRoundSummary(round: Round): Promise<RoundSummaryDto> {
        console.log("findRoundSummary  round -> ", round);
        const winningNumber = await this.winningNumberService.findByRoundId(round.id);
        console.log("findRoundSummary  winningNumber -> ", winningNumber);
        const batchRoundRankingList = await this.findRoundRankingList(round.id);
        console.log("findRoundSummary  batchRoundRankingList -> ", batchRoundRankingList);
        const roundAggregation = await this.findRoundAggregation(round.id);
        console.log("findRoundSummary  roundAggregation -> ", roundAggregation);
        const roundSummaryDto = new RoundSummaryDto();
        roundSummaryDto.roundDto = round.toRoundDto();
        roundSummaryDto.winningNumberDto = isEmpty(winningNumber) ? null : winningNumber.toWinningNumberDto();
        roundSummaryDto.batchRoundAggregationDto = isEmpty(roundAggregation)
            ? null
            : BatchRoundAggregation.new(roundAggregation).toBatchRoundAggregationDto();
        roundSummaryDto.batchRoundRankingDtoList = BatchRoundRanking.fromList(batchRoundRankingList);
        this.logger.log("findRoundSummary  roundSummaryDto -> ", roundSummaryDto);
        return roundSummaryDto;
    }

    /**
     * 게임 회차별 요약정보 페이지별로 조회
     */
    async findRoundSummaryPagination(request: TcpPaginationRequest<GameParameter>): Promise<TcpPaginationResponse<RoundSummaryDto[]>> {
        const response = await this.roundService.findRoundPagination(request);
        this.logger.log("findRoundSummaryPagination  response -> ", response);
        if (isEmpty(response) || isEmpty(response.data)) {
            return TcpPaginationResponse.from<RoundSummaryDto[], PaginationMeta>(null, response.pagination);
        }
        const roundList = response.data;
        const ticketDetailsList = await Promise.all(roundList.map(async (round) => await this.findRoundSummary(round)));
        this.logger.log("findRoundSummaryPaginate  ticketDetailsList -> ", ticketDetailsList);
        return TcpPaginationResponse.from<RoundSummaryDto[], PaginationMeta>(ticketDetailsList, response.pagination);
    }
}
