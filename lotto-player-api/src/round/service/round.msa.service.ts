import { Injectable } from '@nestjs/common';
import {GameKafkaClientService} from "../../common/microservice/kafka-game-client-service";
import {RoundSummaryDto} from "../dto/round-summary.dto";
import {Pagination, TcpPaginationRequest, TcpRequest} from "../../common/microservice/tcp-request";
import {GameParameter, RoundParameter} from "../../game/entity/game.parameter";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {PaginationMeta, TcpPaginationResponse, TcpResponse} from "../../common/microservice/tcp-response";

@Injectable()
export class RoundMsaService {
    constructor(private readonly gameKafkaClientService: GameKafkaClientService) {
    }

    async findRoundSummaryByGameIdAndTurnNumber(gameId: number, turnNumber: number): Promise<RoundSummaryDto> {
        const request = TcpRequest.from<RoundParameter>(RoundParameter.from(gameId, turnNumber));
        const response = await this.gameKafkaClientService.send<TcpResponse<RoundSummaryDto>>(
            GameMessagePatterns.GAME_findRoundSummaryByGameIdAndTurnNumber,
            request,
        );
        return response.data;
    }

    async findRoundSummaryByActive(gameId: number): Promise<RoundSummaryDto> {
        const request = TcpRequest.from<GameParameter>(GameParameter.from(gameId));
        const response = await this.gameKafkaClientService.send<TcpResponse<RoundSummaryDto>>(
            GameMessagePatterns.GAME_findRoundSummaryByActive,
            request);
        return response.data;
    }

    findRoundSummaryPagination(
        gameId: number,
        page: number,
        offset: number,
    ): Promise<TcpPaginationResponse<RoundSummaryDto[], PaginationMeta>> {
        const request = TcpPaginationRequest.from<GameParameter>(GameParameter.from(gameId), Pagination.from(page, offset));
        return this.gameKafkaClientService.send<TcpPaginationResponse<RoundSummaryDto[]>>(
            GameMessagePatterns.GAME_findRoundSummaryPagination,
            request
        );
    }
}
