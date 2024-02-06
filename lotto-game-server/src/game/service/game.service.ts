import {Injectable, Logger} from '@nestjs/common';
import {Game} from "../entity/game.entity";
import {EntityManager, Repository} from "typeorm";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {GameWinningRuleService} from "./game-winning-rule.service";
import {TicketCurrencyService} from "../../ticket/service/ticket-currency.service";
import {LanguageService} from "../../common/service/language.service";
import {LanguageCode} from "../../common/model/common.enum";
import {GameLanguageDto} from "../dto/game-language.dto";
import {LanguageValue} from "../../common/model/language-value.entity";
import {GameDetailsDto} from "../dto/game-details.dto";
import {isEmpty, isNotEmpty} from "class-validator";
import {SaveGameBaseInfoLanguageDto} from "../dto/save-game-base-info-language.dto";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";
import {SaveGameStatusDto} from "../dto/save-game-status.dto";

@Injectable()
export class GameService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(Game) private gameRepository: Repository<Game>,
        private readonly gameWinningRuleService: GameWinningRuleService,
        private readonly ticketCurrencyService: TicketCurrencyService,
        private readonly languageService: LanguageService,
    ) {}

    private readonly logger = new Logger(GameService.name);

    findById(id: number): Promise<Game> {
        return this.gameRepository.findOneBy({ id });
    }

    /**
     * 게임기본정보 언어별 조회
     */
    async findLanguageByGameIdAndLanguageCode(gameId: number, languageCode: LanguageCode): Promise<GameLanguageDto> {
        return this.entityManager
            .createQueryBuilder(Game, "ga")
            .leftJoinAndSelect(LanguageValue, "lv1", "lv1.language_id = ga.name_id AND lv1.language_code = :languageCode", {
                languageCode,
            })
            .leftJoinAndSelect(LanguageValue, "lv2", "lv2.language_id = ga.introduction_id AND lv2.language_code = :languageCode", {
                languageCode,
            })
            .leftJoinAndSelect(LanguageValue, "lv3", "lv3.language_id = ga.sale_period_id AND lv3.language_code = :languageCode", {
                languageCode,
            })
            .leftJoinAndSelect(LanguageValue, "lv4", "lv4.language_id = ga.draw_date_id AND lv4.language_code = :languageCode", {
                languageCode,
            })
            .leftJoinAndSelect(LanguageValue, "lv5", "lv5.language_id = ga.ticket_price_id AND lv5.language_code = :languageCode", {
                languageCode,
            })
            .select("ga.id", "id")
            .addSelect("ga.name_id", "nameId")
            .addSelect("lv1.text", "name")
            .addSelect("ga.introduction_id", "introductionId")
            .addSelect("lv2.text", "introduction")
            .addSelect("ga.sale_period_id", "salePeriodId")
            .addSelect("lv3.text", "salePeriodText")
            .addSelect("ga.draw_date_id", "drawDateId")
            .addSelect("lv4.text", "drawDateText")
            .addSelect("ga.ticket_price_id", "ticketPriceId")
            .addSelect("lv5.text", "ticketPriceText")
            .addSelect("ga.status", "status")
            .where("ga.id = :gameId", { gameId })
            .getRawOne<GameLanguageDto>();
    }

    /**
     * 게임상세정보 언어별 조회
     *   - 게임 기본 정보
     *   - 게임 당첨규칙 정보
     *   - 게임 통화금액 정보
     */
    async findGameDetailsByGameIdAndLanguageCode(gameId: number, languageCode: LanguageCode): Promise<GameDetailsDto> {
        console.log("findGameDetailsByGameId  -> ", gameId);
        const gameLanguageDto = await this.findLanguageByGameIdAndLanguageCode(gameId, languageCode);
        console.log("findGameDetailsByGameId   gameLanguageDto -> ", gameLanguageDto);
        if (isEmpty(gameLanguageDto)) {
            return;
        }
        const gameWinningRuleLanguageList = await this.gameWinningRuleService.findLanguageByGameIdAndLanguageCode(gameId, languageCode);
        const defaultTicketCurrencyId = Number(1);
        const ticketCurrency = await this.ticketCurrencyService.findById(defaultTicketCurrencyId);
        return GameDetailsDto.from(GameLanguageDto.new(gameLanguageDto), gameWinningRuleLanguageList, ticketCurrency);
    }

    /**
     * 게임기본정보 언어별 수정
     */
    async editGameBaseInfo(saveGameBaseInfoLanguageDto: SaveGameBaseInfoLanguageDto, languageCode: LanguageCode): Promise<GameDetailsDto> {
        const game = await this.findById(saveGameBaseInfoLanguageDto.id);
        if (isEmpty(game)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_001);
        }

        if (isNotEmpty(saveGameBaseInfoLanguageDto.name)) {
            const nameLanguage = await this.languageService.saveLanguageKeyValue(
                game.nameId,
                "game",
                "name_id",
                languageCode,
                saveGameBaseInfoLanguageDto.name,
            );
            game.nameId = nameLanguage.languageId;
        }

        if (isNotEmpty(saveGameBaseInfoLanguageDto.introduction)) {
            const introductionLanguage = await this.languageService.saveLanguageKeyValue(
                game.introductionId,
                "game",
                "introduction_id",
                languageCode,
                saveGameBaseInfoLanguageDto.introduction,
            );
            game.introductionId = introductionLanguage.languageId;
        }

        if (isNotEmpty(saveGameBaseInfoLanguageDto.salePeriodText)) {
            const salePeriodLanguage = await this.languageService.saveLanguageKeyValue(
                game.salePeriodId,
                "game",
                "sale_period_id",
                languageCode,
                saveGameBaseInfoLanguageDto.salePeriodText,
            );
            game.salePeriodId = salePeriodLanguage.languageId;
        }

        if (isNotEmpty(saveGameBaseInfoLanguageDto.drawDateText)) {
            const drawDateLanguage = await this.languageService.saveLanguageKeyValue(
                game.drawDateId,
                "game",
                "draw_date_id",
                languageCode,
                saveGameBaseInfoLanguageDto.drawDateText,
            );
            game.drawDateId = drawDateLanguage.languageId;
        }

        if (isNotEmpty(saveGameBaseInfoLanguageDto.ticketPriceText)) {
            const ticketPriceLanguage = await this.languageService.saveLanguageKeyValue(
                game.ticketPriceId,
                "game",
                "ticket_price_id",
                languageCode,
                saveGameBaseInfoLanguageDto.ticketPriceText,
            );
            game.ticketPriceId = ticketPriceLanguage.languageId;
        }

        const updateResult = await this.gameRepository.update({ id: game.id }, game);
        if (isEmpty(updateResult) || updateResult.affected <= 0) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_009);
        }
        return this.findGameDetailsByGameIdAndLanguageCode(game.id, languageCode);
    }

    /**
     * 게임 상태 수정
     */
    async editGameStatus(saveGameStatusDto: SaveGameStatusDto, languageCode: LanguageCode): Promise<GameDetailsDto> {
        const game = await this.findById(saveGameStatusDto.id);
        if (isEmpty(game)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_001);
        }
        const updateResult = await this.gameRepository.update({ id: game.id }, { status: saveGameStatusDto.status });
        if (isEmpty(updateResult) || updateResult.affected <= 0) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_009);
        }
        return this.findGameDetailsByGameIdAndLanguageCode(game.id, languageCode);
    }

}
