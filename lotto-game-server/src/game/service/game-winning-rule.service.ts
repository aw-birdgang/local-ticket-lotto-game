import { Injectable } from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {EntityManager, Repository} from "typeorm";
import {GameWinningRule} from "../entity/game-winning-rule.entity";
import {LanguageService} from "../../common/service/language.service";
import {LanguageCode} from "../../common/model/common.enum";
import {GameWinningRuleLanguageDto} from "../dto/game-winning-rule-language.dto";
import {LanguageValue} from "../../common/model/language-value.entity";
import {SaveGameWinningRuleLanguageDto} from "../dto/save-game-winning-rule-language.dto";
import {isEmpty, isNotEmpty} from "class-validator";
import {ErrorCodes} from "../../common/exception/error.enum";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";

@Injectable()
export class GameWinningRuleService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(GameWinningRule) private gameWinningRuleRepository: Repository<GameWinningRule>,
        private readonly languageService: LanguageService,
    ) {}

    findById(id: number): Promise<GameWinningRule> {
        return this.gameWinningRuleRepository.findOneBy({ id: id });
    }

    findByGameId(gameId: number): Promise<GameWinningRule[]> {
        return this.gameWinningRuleRepository.findBy({ gameId });
    }

    findByGameIdAndRanking(gameId: number, ranking: number): Promise<GameWinningRule> {
        return this.gameWinningRuleRepository.findOneBy({ gameId, ranking });
    }

    findLanguageByGameIdAndLanguageCode(gameId: number, languageCode: LanguageCode): Promise<GameWinningRuleLanguageDto[]> {
        const queryBuilder = this.entityManager
            .createQueryBuilder(GameWinningRule, "gwr")
            .leftJoinAndSelect(LanguageValue, "lv1", "lv1.language_id = gwr.ranking_text_id AND lv1.language_code = :languageCode", {
                languageCode,
            })
            .leftJoinAndSelect(LanguageValue, "lv2", "lv2.language_id = gwr.matching_text_id AND lv2.language_code = :languageCode", {
                languageCode,
            })
            .leftJoinAndSelect(LanguageValue, "lv3", "lv3.language_id = gwr.odds_text_id AND lv3.language_code = :languageCode", {
                languageCode,
            })
            .leftJoinAndSelect(LanguageValue, "lv4", "lv4.language_id = gwr.prize_amount_text_id AND lv3.language_code = :languageCode", {
                languageCode,
            })
            .where("gwr.game_id = :gameId", { gameId })
            .select("gwr.id", "id")
            .addSelect("gwr.game_id", "gameId")
            .addSelect("gwr.ranking", "ranking")
            .addSelect("gwr.ranking_text_id", "rankingTextId")
            .addSelect("lv1.text", "rankingText")
            .addSelect("gwr.matching_text_id", "matchingTextId")
            .addSelect("lv2.text", "matchingText")
            .addSelect("gwr.odds_text_id", "oddsTextId")
            .addSelect("lv3.text", "oddsText")
            .addSelect("gwr.prize_amount_text_id", "prizeAmountTextId")
            .addSelect("lv4.text", "prizeAmountText")
            .orderBy({ ranking: "ASC" });
        console.log("findLanguageByGameIdAndLanguageCode  query -> ", queryBuilder.getQuery());
        return queryBuilder.getRawMany<GameWinningRuleLanguageDto>();
    }

    async deleteByGameId(gameId: number) {
        const deleteResult = await this.gameWinningRuleRepository.delete({ gameId });
        return deleteResult.affected | 0;
    }

    async saveGameWinningRule(
        saveGameWinningRuleLanguageDto: SaveGameWinningRuleLanguageDto,
        gameWinningRule: GameWinningRule,
        languageCode: LanguageCode,
    ) {
        if (isNotEmpty(saveGameWinningRuleLanguageDto.rankingText)) {
            const rankingTextLanguage = await this.languageService.saveLanguageKeyValue(
                gameWinningRule.rankingTextId,
                "game_winning_rule",
                "ranking_text_id",
                languageCode,
                saveGameWinningRuleLanguageDto.rankingText,
            );
            gameWinningRule.rankingTextId = rankingTextLanguage.languageId;
        }
        if (isNotEmpty(saveGameWinningRuleLanguageDto.matchingText)) {
            const ruleDescriptionLanguage = await this.languageService.saveLanguageKeyValue(
                gameWinningRule.matchingTextId,
                "game_winning_rule",
                "matching_text_id",
                languageCode,
                saveGameWinningRuleLanguageDto.matchingText,
            );
            gameWinningRule.matchingTextId = ruleDescriptionLanguage.languageId;
        }
        if (isNotEmpty(saveGameWinningRuleLanguageDto.oddsText)) {
            const winningAmountTextLanguage = await this.languageService.saveLanguageKeyValue(
                gameWinningRule.oddsTextId,
                "game_winning_rule",
                "odds_text_id",
                languageCode,
                saveGameWinningRuleLanguageDto.oddsText,
            );
            gameWinningRule.oddsTextId = winningAmountTextLanguage.languageId;
        }
        if (isNotEmpty(saveGameWinningRuleLanguageDto.prizeAmountText)) {
            const winningAmountTextLanguage = await this.languageService.saveLanguageKeyValue(
                gameWinningRule.prizeAmountTextId,
                "game_winning_rule",
                "prize_amount_text_id",
                languageCode,
                saveGameWinningRuleLanguageDto.prizeAmountText,
            );
            gameWinningRule.prizeAmountTextId = winningAmountTextLanguage.languageId;
        }

        if (isEmpty(gameWinningRule.id) || gameWinningRule.id == 0) {
            const insertResult = await this.gameWinningRuleRepository.insert(gameWinningRule);
            if (isEmpty(insertResult) || isEmpty(insertResult.identifiers) || isEmpty(insertResult.identifiers[0])) {
                throw new BusinessRpcException(ErrorCodes.BUS_ERROR_008);
            }
        } else {
            const updateResult = await this.gameWinningRuleRepository.update({ id: gameWinningRule.id }, gameWinningRule);
            if (isEmpty(updateResult) || updateResult.affected <= 0) {
                throw new BusinessRpcException(ErrorCodes.BUS_ERROR_009);
            }
        }
    }

    async saveList(gameWinningRuleLanguageList: SaveGameWinningRuleLanguageDto[], languageCode: LanguageCode): Promise<void> {
        if (isEmpty(gameWinningRuleLanguageList) || gameWinningRuleLanguageList.length == 0) {
            return;
        }
        await Promise.all(
            gameWinningRuleLanguageList.map(async (gwr) => {
                let gameWinningRule = await this.findByGameIdAndRanking(gwr.gameId, gwr.ranking);
                if (isEmpty(gameWinningRule)) {
                    gameWinningRule = GameWinningRule.from(null, gwr.gameId, gwr.ranking, 0, 0, 0, 0);
                }
                await this.saveGameWinningRule(gwr, gameWinningRule, languageCode);
            }),
        );
    }
}
