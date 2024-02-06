import {Controller, Logger} from '@nestjs/common';
import {RoundService} from "../service/round.service";
import {BatchAggregationService} from "../service/batch-aggregation.service";
import {WinningNumberService} from "../service/winning-number.service";
import {MessagePattern} from "@nestjs/microservices";
import {RoundDto} from "../dto/round.dto";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {TcpPaginationRequest, TcpRequest} from "../../common/microservice/tcp-request";
import {TcpPaginationResponse, TcpResponse} from "../../common/microservice/tcp-response";
import {GameParameter, RoundParameter} from "../entity/game.parameter";
import {isEmpty} from "class-validator";
import {WinningNumberDto} from "../dto/winning-number.dto";
import {RoundSummaryDto} from "../dto/round-summary.dto";
import {CreateWinningNumberDto} from "../dto/create-winning-number.dto";

@Controller()
export class RoundController {
    constructor(
        private readonly roundService: RoundService,
        private readonly batchService: BatchAggregationService,
        private readonly winningNumberService: WinningNumberService
    ) {
    }

    private readonly logger = new Logger(RoundController.name);

    @MessagePattern(GameMessagePatterns.GAME_findRoundById)
    async findRoundById(request: TcpRequest<number>): Promise<TcpResponse<RoundDto>> {
        this.logger.log("findRoundById -> ", request);
        const round = await this.roundService.findById(Number(request.data));
        return TcpResponse.from(round.toRoundDto());
    }

    @MessagePattern(GameMessagePatterns.GAME_findRoundByGameIdAndTurnNumber)
    async findRoundByGameIdAndTurnNumber(request: TcpRequest<RoundParameter>): Promise<TcpResponse<RoundDto>> {
        this.logger.log("findRoundById -> ", request);
        const round = await this.roundService.findByGameIdAndTurnNumber(request.data.gameId, request.data.turnNumber);
        return TcpResponse.from(round.toRoundDto());
    }

    @MessagePattern(GameMessagePatterns.GAME_findRoundByActive)
    async findRoundByActive(request: TcpRequest<number>): Promise<TcpResponse<RoundDto>> {
        this.logger.log("findRoundByActive -> ", request);
        const round = await this.roundService.findByActive(Number(request.data));
        return TcpResponse.from(isEmpty(round) ? null : round.toRoundDto());
    }

    @MessagePattern(GameMessagePatterns.GAME_divideRoundByCycleCode)
    async divideRoundByCycleCode(request: TcpPaginationRequest<number>): Promise<TcpResponse<boolean>> {
        this.logger.log("divideRoundByCycleCode  request -> ", request);
        await this.roundService.divideRoundByCycleCode(Number(request.data));
        return TcpResponse.from<boolean>(true);
    }

    @MessagePattern(GameMessagePatterns.GAME_findWinningNumberByRoundId)
    async findWinningNumberByRoundId(request: TcpRequest<number>): Promise<TcpResponse<WinningNumberDto>> {
        this.logger.log("findWinningNumberByRoundId -> ", request);
        const winningNumber = await this.winningNumberService.findByRoundId(Number(request.data));
        this.logger.log("findWinningNumberByRoundId  winningNumber -> ", winningNumber);
        return TcpResponse.from(isEmpty(winningNumber) ? null : winningNumber.toWinningNumberDto());
    }

    @MessagePattern(GameMessagePatterns.GAME_findRoundSummaryByGameIdAndTurnNumber)
    async findRoundSummaryByGameIdAndTurnNumber(request: TcpRequest<RoundParameter>): Promise<TcpResponse<RoundSummaryDto>> {
        this.logger.log("findRoundSummaryByGameIdAndTurnNumber -> ", request);
        const round = await this.roundService.findByGameIdAndTurnNumber(request.data.gameId, request.data.turnNumber);
        const roundSummary = await this.batchService.findRoundSummary(round);
        return TcpResponse.from(roundSummary);
    }

    @MessagePattern(GameMessagePatterns.GAME_findRoundSummaryByActive)
    async findRoundSummaryByActive(request: TcpRequest<GameParameter>): Promise<TcpResponse<RoundSummaryDto>> {
        this.logger.log("findRoundSummaryByActive  request -> ", request);
        const round = await this.roundService.findByActive(request.data.gameId);
        const roundSummary = await this.batchService.findRoundSummary(round);
        return TcpResponse.from(roundSummary);
    }

    @MessagePattern(GameMessagePatterns.GAME_findRoundSummaryPagination)
    findRoundSummaryPagination(request: TcpPaginationRequest<GameParameter>): Promise<TcpPaginationResponse<RoundSummaryDto[]>> {
        this.logger.log("findRoundSummaryPagination  request -> ", request);
        return this.batchService.findRoundSummaryPagination(request);
    }

    @MessagePattern(GameMessagePatterns.GAME_createWinningNumber)
    async createWinningNumber(request: TcpPaginationRequest<CreateWinningNumberDto>): Promise<TcpResponse<WinningNumberDto>> {
        this.logger.log("createWinningNumber  request -> ", request);
        const winningNumber = await this.winningNumberService.createWinningNumber(request.data);
        return TcpResponse.from<WinningNumberDto>(winningNumber.toWinningNumberDto());
    }
}
