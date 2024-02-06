import {Injectable, Logger} from '@nestjs/common';
import {Round} from "../entity/round.entity";
import {EntityManager, Repository} from "typeorm";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {GameService} from "./game.service";
import {RoundDto} from "../dto/round.dto";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";
import {CycleCode, RoundStatus} from "../entity/game.enum";
import {GameParameter} from "../entity/game.parameter";
import {isEmpty} from "class-validator";
import {TcpPaginationRequest} from "../../common/microservice/tcp-request";
import {PaginationMeta, TcpPaginationResponse} from "../../common/microservice/tcp-response";

@Injectable()
export class RoundService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(Round) private readonly roundRepository: Repository<Round>,
        private readonly gameService: GameService,
    ) {}

    private readonly logger = new Logger(RoundService.name);

    /**
     * 게임 회차 정보 등록
     */
    async create(gameId: number): Promise<RoundDto> {
        const game = await this.gameService.findById(gameId);
        if (!game) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_001);
        }

        const lastRound = await this.findByActive(gameId);
        if (!lastRound) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_001);
        }

        const defaultGameId = Number(1);
        let round = new Round();
        round.gameId = defaultGameId;
        round.turnNumber = lastRound.turnNumber + 1;
        round.startDate = new Date();
        round.endDate = new Date();
        round.startDate.setDate(lastRound.startDate.getDate() + 7);
        round.endDate.setDate(lastRound.endDate.getDate() + 7);
        round.status = RoundStatus.READY;

        round = await this.roundRepository.save(round);
        return round.toRoundDto();
    }

    /**
     * 게임회차 주기코드 수정
     *   - 테스트위해 CycleCode.TEN30( 10분 영업시간, 30분 추첨&마감&당첨지급 강제 수정 )
     */
    async resetRoundByCycleCode(cycleCode: CycleCode) {
        const activeRound = await this.findByActive(1);
        if (isEmpty(activeRound)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_002);
        }
        const currentDate: Date = new Date(); // UTC Date
        this.logger.log("resetRoundByCycleCode  currentDate -> ", currentDate);

        let startDate: Date = new Date(currentDate);
        startDate = new Date(startDate.setUTCSeconds(currentDate.getUTCSeconds() + 1));
        let endDate: Date = new Date(currentDate);
        const saleStartDate: Date = new Date(currentDate);
        let saleEndDate: Date = new Date(currentDate);
        let drawStartDate: Date = new Date(currentDate);
        let drawEndDate: Date = new Date(currentDate);
        let settlingStartDate: Date = new Date(currentDate);
        let settlingEndDate: Date = new Date(currentDate);
        let prizeStartDate: Date = new Date(currentDate);
        let prizeEndDate: Date = new Date(currentDate);
        if (cycleCode == CycleCode.WEEKLY) {
            endDate = new Date(endDate.setUTCDate(startDate.getUTCDate() + 7));
            endDate = new Date(endDate.setUTCHours(23, 59, 59, 0));
            saleEndDate = new Date(saleEndDate.setUTCDate(saleStartDate.getUTCDate() + 7));
            saleEndDate = new Date(saleEndDate.setUTCHours(19, 59, 59, 0));
            drawStartDate = new Date(saleEndDate);
            drawEndDate = new Date(saleEndDate);
            drawStartDate = new Date(drawStartDate.setUTCSeconds(saleEndDate.getUTCSeconds() + 1));
            drawEndDate = new Date(drawEndDate.setUTCHours(saleEndDate.getUTCHours() + 2));
            settlingStartDate = new Date(drawEndDate);
            settlingEndDate = new Date(drawEndDate);
            settlingStartDate = new Date(settlingStartDate.setUTCSeconds(drawEndDate.getUTCSeconds() + 1));
            settlingEndDate = new Date(settlingEndDate.setUTCHours(drawEndDate.getUTCHours() + 2));
            prizeStartDate = new Date(settlingEndDate);
            prizeEndDate = new Date(settlingEndDate);
            prizeStartDate = new Date(prizeStartDate.setUTCSeconds(drawEndDate.getUTCSeconds() + 1));
            prizeEndDate = new Date(prizeEndDate.setUTCMonth(drawEndDate.getUTCMonth() + 3));
        } else if (cycleCode == CycleCode.TEN30) {
            endDate = new Date(endDate.setUTCMinutes(startDate.getUTCMinutes() + 40));
            saleEndDate = new Date(saleEndDate.setUTCMinutes(saleStartDate.getUTCMinutes() + 10));
            drawStartDate = new Date(saleEndDate);
            drawEndDate = new Date(saleEndDate);
            drawStartDate = new Date(drawStartDate.setUTCSeconds(saleEndDate.getUTCSeconds() + 1));
            drawEndDate = new Date(drawEndDate.setUTCMinutes(saleEndDate.getUTCMinutes() + 30));
            settlingStartDate = new Date(drawEndDate);
            settlingEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(drawEndDate);
            prizeEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(prizeStartDate.setUTCSeconds(drawEndDate.getUTCSeconds() + 1));
            prizeEndDate = new Date(prizeEndDate.setUTCMonth(drawEndDate.getUTCMonth() + 3));
        } else if (cycleCode == CycleCode.FIFTEEN30) {
            endDate = new Date(endDate.setUTCMinutes(startDate.getUTCMinutes() + 45));
            saleEndDate = new Date(saleEndDate.setUTCMinutes(saleStartDate.getUTCMinutes() + 15));
            drawStartDate = new Date(saleEndDate);
            drawEndDate = new Date(saleEndDate);
            drawStartDate = new Date(drawStartDate.setUTCSeconds(saleEndDate.getUTCSeconds() + 1));
            drawEndDate = new Date(drawEndDate.setUTCMinutes(saleEndDate.getUTCMinutes() + 30));
            settlingStartDate = new Date(drawEndDate);
            settlingEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(drawEndDate);
            prizeEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(prizeStartDate.setUTCSeconds(drawEndDate.getUTCSeconds() + 1));
            prizeEndDate = new Date(prizeEndDate.setUTCMonth(drawEndDate.getUTCMonth() + 3));
        } else if (cycleCode == CycleCode.TWENTY30) {
            endDate = new Date(endDate.setUTCMinutes(startDate.getUTCMinutes() + 50));
            saleEndDate = new Date(saleEndDate.setUTCMinutes(saleStartDate.getUTCMinutes() + 20));
            drawStartDate = new Date(saleEndDate);
            drawEndDate = new Date(saleEndDate);
            drawStartDate = new Date(drawStartDate.setUTCSeconds(saleEndDate.getUTCSeconds() + 1));
            drawEndDate = new Date(drawEndDate.setUTCMinutes(saleEndDate.getUTCMinutes() + 30));
            settlingStartDate = new Date(drawEndDate);
            settlingEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(drawEndDate);
            prizeEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(prizeStartDate.setUTCSeconds(drawEndDate.getUTCSeconds() + 1));
            prizeEndDate = new Date(prizeEndDate.setUTCMonth(drawEndDate.getUTCMonth() + 3));
        }

        activeRound.startDate = startDate;
        activeRound.endDate = endDate;
        activeRound.status = RoundStatus.ACTIVE;
        activeRound.saleStartDate = saleStartDate;
        activeRound.saleEndDate = saleEndDate;
        activeRound.drawStartDate = drawStartDate;
        activeRound.drawEndDate = drawEndDate;
        activeRound.settlingStartDate = settlingStartDate;
        activeRound.settlingEndDate = settlingEndDate;
        activeRound.prizeStartDate = prizeStartDate;
        activeRound.prizeEndDate = prizeEndDate;
        activeRound.cycleCode = cycleCode;

        this.logger.log("resetRoundByCycleCode  new start~end date -> ", startDate + " , " + endDate);
        this.logger.log("resetRoundByCycleCode  currentRound -> ", activeRound);
        const updateResult = await this.roundRepository.update({ id: activeRound.id }, activeRound);
        this.logger.log("resetRoundByCycleCode  updateResult -> ", updateResult);
        return activeRound;
    }

    /**
     * 현재 활성화된 게임회차는 현재일시로 강제 종료처리하고,  선택된 CycleCode에 맞게 게임 회차 추가
     *   - 테스트위해 CycleCode.TEN30( 10분 영업시간, 30분 추첨&마감&당첨지급 강제 수정 )
     */
    async divideRoundByCycleCode(roundId: number) {
        const activeRound = await this.findById(roundId);
        if (isEmpty(activeRound)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_002);
        }
        const currentDate: Date = new Date(); // UTC Date
        this.logger.log("saveRoundDivideByCycleCode  currentDate -> ", currentDate);

        activeRound.endDate = currentDate;
        activeRound.status = RoundStatus.INACTIVE;
        activeRound.saleStartDate = currentDate;
        activeRound.saleEndDate = currentDate;
        activeRound.drawStartDate = currentDate;
        activeRound.drawEndDate = currentDate;
        activeRound.settlingStartDate = currentDate;
        activeRound.settlingEndDate = currentDate;
        const activePrizeStartDate = new Date(currentDate);
        const activePrizeEndDate = new Date(currentDate);
        activeRound.prizeStartDate = new Date(activePrizeStartDate.setUTCSeconds(currentDate.getUTCSeconds() + 1));
        activeRound.prizeEndDate = new Date(activePrizeEndDate.setUTCMonth(currentDate.getUTCMonth() + 3));

        let startDate = new Date(currentDate);
        startDate = new Date(startDate.setUTCSeconds(currentDate.getUTCSeconds() + 1));
        let endDate = new Date(currentDate);
        const saleStartDate = new Date(currentDate);
        let saleEndDate = new Date(currentDate);
        let drawStartDate = new Date(currentDate);
        let drawEndDate = new Date(currentDate);
        let settlingStartDate = new Date(currentDate);
        let settlingEndDate = new Date(currentDate);
        let prizeStartDate = new Date(currentDate);
        let prizeEndDate = new Date(currentDate);
        if (activeRound.cycleCode == CycleCode.WEEKLY) {
            endDate = new Date(endDate.setUTCDate(startDate.getUTCDate() + 7));
            endDate = new Date(endDate.setUTCHours(23, 59, 59, 0));
            saleEndDate = new Date(saleEndDate.setUTCDate(saleStartDate.getUTCDate() + 7));
            saleEndDate = new Date(saleEndDate.setUTCHours(19, 59, 59, 0));
            drawStartDate = new Date(saleEndDate);
            drawEndDate = new Date(saleEndDate);
            drawStartDate = new Date(drawStartDate.setUTCSeconds(saleEndDate.getUTCSeconds() + 1));
            drawEndDate = new Date(drawEndDate.setUTCHours(saleEndDate.getUTCHours() + 2));
            settlingStartDate = new Date(drawEndDate);
            settlingEndDate = new Date(drawEndDate);
            settlingStartDate = new Date(settlingStartDate.setUTCSeconds(drawEndDate.getUTCSeconds() + 1));
            settlingEndDate = new Date(settlingEndDate.setUTCHours(drawEndDate.getUTCHours() + 2));
            prizeStartDate = new Date(settlingEndDate);
            prizeEndDate = new Date(settlingEndDate);
            prizeStartDate = new Date(prizeStartDate.setUTCSeconds(drawEndDate.getUTCSeconds() + 1));
            prizeEndDate = new Date(prizeEndDate.setUTCMonth(drawEndDate.getUTCMonth() + 3));
        } else if (activeRound.cycleCode == CycleCode.TEN30) {
            endDate = new Date(endDate.setUTCMinutes(startDate.getUTCMinutes() + 40));
            saleEndDate = new Date(saleEndDate.setUTCMinutes(saleStartDate.getUTCMinutes() + 10));
            drawStartDate = new Date(saleEndDate);
            drawEndDate = new Date(saleEndDate);
            drawStartDate = new Date(drawStartDate.setUTCSeconds(saleEndDate.getUTCSeconds() + 1));
            drawEndDate = new Date(drawEndDate.setUTCMinutes(saleEndDate.getUTCMinutes() + 30));
            settlingStartDate = new Date(drawEndDate);
            settlingEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(drawEndDate);
            prizeEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(prizeStartDate.setUTCSeconds(drawEndDate.getUTCSeconds() + 1));
            prizeEndDate = new Date(prizeEndDate.setUTCMonth(drawEndDate.getUTCMonth() + 3));
        } else if (activeRound.cycleCode == CycleCode.FIFTEEN30) {
            endDate = new Date(endDate.setUTCMinutes(startDate.getUTCMinutes() + 45));
            saleEndDate = new Date(saleEndDate.setUTCMinutes(saleStartDate.getUTCMinutes() + 15));
            drawStartDate = new Date(saleEndDate);
            drawEndDate = new Date(saleEndDate);
            drawStartDate = new Date(drawStartDate.setUTCSeconds(saleEndDate.getUTCSeconds() + 1));
            drawEndDate = new Date(drawEndDate.setUTCMinutes(saleEndDate.getUTCMinutes() + 30));
            settlingStartDate = new Date(drawEndDate);
            settlingEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(drawEndDate);
            prizeEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(prizeStartDate.setUTCSeconds(drawEndDate.getUTCSeconds() + 1));
            prizeEndDate = new Date(prizeEndDate.setUTCMonth(drawEndDate.getUTCMonth() + 3));
        } else if (activeRound.cycleCode == CycleCode.TWENTY30) {
            endDate = new Date(endDate.setUTCMinutes(startDate.getUTCMinutes() + 50));
            saleEndDate = new Date(saleEndDate.setUTCMinutes(saleStartDate.getUTCMinutes() + 20));
            drawStartDate = new Date(saleEndDate);
            drawEndDate = new Date(saleEndDate);
            drawStartDate = new Date(drawStartDate.setUTCSeconds(saleEndDate.getUTCSeconds() + 1));
            drawEndDate = new Date(drawEndDate.setUTCMinutes(saleEndDate.getUTCMinutes() + 30));
            settlingStartDate = new Date(drawEndDate);
            settlingEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(drawEndDate);
            prizeEndDate = new Date(drawEndDate);
            prizeStartDate = new Date(prizeStartDate.setUTCSeconds(drawEndDate.getUTCSeconds() + 1));
            prizeEndDate = new Date(prizeEndDate.setUTCMonth(drawEndDate.getUTCMonth() + 3));
        }

        const newRound = new Round();
        newRound.gameId = activeRound.gameId;
        newRound.turnNumber = activeRound.turnNumber + 1;
        newRound.startDate = startDate;
        newRound.endDate = endDate;
        newRound.status = RoundStatus.ACTIVE;
        newRound.saleStartDate = saleStartDate;
        newRound.saleEndDate = saleEndDate;
        newRound.drawStartDate = drawStartDate;
        newRound.drawEndDate = drawEndDate;
        newRound.settlingStartDate = settlingStartDate;
        newRound.settlingEndDate = settlingEndDate;
        newRound.prizeStartDate = prizeStartDate;
        newRound.prizeEndDate = prizeEndDate;
        newRound.cycleCode = activeRound.cycleCode;


        this.logger.log("saveRoundDivideByCycleCode  new start~end date -> ", startDate + " , " + endDate);
        this.logger.log("saveRoundDivideByCycleCode  newRound -> ", newRound);
        await this.roundRepository.update({ id: activeRound.id }, activeRound);
        const insertResult = await this.roundRepository.insert(newRound);
        this.logger.log("saveRoundDivideByCycleCode  insertResult -> ", insertResult);
        return newRound;
    }

    findById(id: number): Promise<Round> {
        return this.roundRepository.findOneBy({ id });
    }

    findByGameIdAndTurnNumber(gameId: number, turnNumber: number): Promise<Round> {
        return this.roundRepository.findOneBy({ gameId, turnNumber });
    }

    findByActive(gameId: number): Promise<Round> {
        // .andWhere(`round.id = (select max(id) from round where id = round.id`)
        return this.entityManager
            .createQueryBuilder(Round, "round")
            .where("round.game_id = :gameId", { gameId })
            .andWhere("round.status = :status", { status: RoundStatus.ACTIVE })
            .getOne();
    }

    /**
     * 게임 회차 정보 페이지별 조회
     */
    async findRoundPagination(request: TcpPaginationRequest<GameParameter>): Promise<TcpPaginationResponse<Round[]>> {
        const [roundList, total] = await this.roundRepository.findAndCount({
            where: { gameId: request.data.gameId },
            order: { turnNumber: "DESC" },
            take: request.pagination.offset,
            skip: (request.pagination.page - 1) * request.pagination.offset,
        });
        return TcpPaginationResponse.from<Round[]>(
            roundList,
            PaginationMeta.from(total, request.pagination.page, Math.ceil(total / request.pagination.offset)),
        );
    }

}
