import {Injectable, Logger} from '@nestjs/common';
import {GameKafkaClientService} from "../../common/microservice/kafka-game-client-service";
import {TcpRequest} from "../../common/microservice/tcp-request";
import {GameDetailsDto} from "../dto/game-details.dto";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {GameWinningRuleLanguageDto} from "../dto/game-winning-rule-language.dto";

@Injectable()
export class GameMsaService {
    constructor(private readonly gameKafkaClientService: GameKafkaClientService) {
    }

    private readonly logger = new Logger(GameMsaService.name);

    async findGameDetailsByGameId(gameId: number, languageCode: string): Promise<GameDetailsDto> {
        const request = TcpRequest.from<number>(gameId, {languageCode});
        const response = await this.gameKafkaClientService.send<TcpResponse<GameDetailsDto>>(
            GameMessagePatterns.GAME_findRoundSummaryByGameIdAndTurnNumber,
            request
        );
        return response.data;
    }

    async findGameWinningRulesByGameId(gameId: number, languageCode: string): Promise<GameWinningRuleLanguageDto[]> {
        this.logger.log("findGameDetailsByGameId  languageCode -> ", languageCode);
        const request = TcpRequest.from<number>(gameId, {languageCode});
        const response = await this.gameKafkaClientService.send<TcpResponse<GameWinningRuleLanguageDto[]>>(
            GameMessagePatterns.GAME_findGameWinningRulesByGameId,
            request,
        );
        return response.data;
    }
}
