import {Controller, Logger} from '@nestjs/common';
import {GameService} from "../service/game.service";
import {GameWinningRuleService} from "../service/game-winning-rule.service";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {MessagePattern} from "@nestjs/microservices";
import {TcpRequest} from "../../common/microservice/tcp-request";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {isEmpty} from "class-validator";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";
import {GameDetailsDto} from "../dto/game-details.dto";
import {SaveGameBaseInfoLanguageDto} from "../dto/save-game-base-info-language.dto";
import {SaveGameStatusDto} from "../dto/save-game-status.dto";
import {GameWinningRuleLanguageDto} from "../dto/game-winning-rule-language.dto";
import {SaveGameWinningRuleDto} from "../dto/save-game-winning-rule.dto";

@Controller()
export class GameController {
    constructor(
        private readonly gameService: GameService,
        private readonly gameWinningRuleService: GameWinningRuleService
    ) {
    }

    private readonly logger = new Logger(GameController.name);

    /**
     * find game details
     * @param request gameId
     */
    @MessagePattern(GameMessagePatterns.GAME_findGameDetailsByGameId)
    async findGameDetailsByGameId(request: TcpRequest<number>): Promise<TcpResponse<GameDetailsDto>> {
        this.logger.log("findGameDetailsByGameId -> ", request);
        const languageCode = request.headers["languageCode"];
        if (isEmpty(languageCode)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_012);
        }
        const gameDetailDto = await this.gameService.findGameDetailsByGameIdAndLanguageCode(Number(request.data), languageCode);
        return TcpResponse.from<GameDetailsDto>(gameDetailDto);
    }

    /**
     * edit lotto game information
     * @param request
     */
    @MessagePattern(GameMessagePatterns.GAME_editGameBaseInfo)
    async editGameBaseInfo(request: TcpRequest<SaveGameBaseInfoLanguageDto>): Promise<TcpResponse<GameDetailsDto>> {
        this.logger.log("editGameBaseInfo -> ", request);
        const languageCode = request.headers["languageCode"];
        if (isEmpty(languageCode)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_012);
        }
        const gameDetailsDto = await this.gameService.editGameBaseInfo(request.data, languageCode);
        return TcpResponse.from<GameDetailsDto>(gameDetailsDto);
    }

    /**
     * edit lotto game status
     * @param request
     */
    @MessagePattern(GameMessagePatterns.GAME_editGameStatus)
    async editGameStatus(request: TcpRequest<SaveGameStatusDto>): Promise<TcpResponse<GameDetailsDto>> {
        this.logger.log("editGameStatus -> ", request);
        const languageCode = request.headers["languageCode"];
        if (isEmpty(languageCode)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_012);
        }
        const gameDetailsDto = await this.gameService.editGameStatus(request.data, languageCode);
        return TcpResponse.from<GameDetailsDto>(gameDetailsDto);
    }

    /**
     * find Game winning rules
     * @param request gameId
     */
    @MessagePattern(GameMessagePatterns.GAME_findGameWinningRulesByGameId)
    async findGameWinningRulesByGameId(request: TcpRequest<number>): Promise<TcpResponse<GameWinningRuleLanguageDto[]>> {
        this.logger.log("findGameWinningRulesByGameId -> ", request);
        const languageCode = request.headers["languageCode"];
        if (isEmpty(languageCode)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_012);
        }
        const gameWinningRuleLanguageList = await this.gameWinningRuleService.findLanguageByGameIdAndLanguageCode(
            Number(request.data),
            languageCode
        );
        return TcpResponse.from<GameWinningRuleLanguageDto[]>(gameWinningRuleLanguageList);
    }

    /**
     * save lotto game rules
     * @param request
     */
    @MessagePattern(GameMessagePatterns.GAME_saveGameWinningRules)
    async saveGameWinningRules(request: TcpRequest<SaveGameWinningRuleDto>): Promise<TcpResponse<GameWinningRuleLanguageDto[]>> {
        this.logger.log("saveGameWinningRules -> ", request);
        const languageCode = request.headers["languageCode"];
        if (isEmpty(languageCode)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_012);
        }
        const saveList = isEmpty(request.data) ? null : request.data.saveGameWinningRuleLanguageList;
        await this.gameWinningRuleService.saveList(saveList, languageCode);
        const gameWinningRuleLanguageList = await this.gameWinningRuleService.findLanguageByGameIdAndLanguageCode(
            request.data.gameId,
            languageCode
        );
        return TcpResponse.from<GameWinningRuleLanguageDto[]>(gameWinningRuleLanguageList);
    }
}
