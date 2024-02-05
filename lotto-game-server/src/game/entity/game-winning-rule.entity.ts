import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {GameWinningRuleDto} from "../dto/game-winning-rule.dto";

@Entity("game_winning_rule")
@Index("uk1_game_winning_rule", ["gameId", "ranking"], { unique: true })
export class GameWinningRule {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "game_id", type: "int" })
  gameId: number;

  @Column({ name: "ranking", type: "tinyint" })
  ranking: number;

  @Column({ name: "ranking_text_id", type: "int", default: 0 })
  rankingTextId: number;

  @Column({ name: "matching_text_id", type: "int", default: 0 })
  matchingTextId: number;

  @Column({ name: "odds_text_id", type: "int", default: 0 })
  oddsTextId: number;

  @Column({ name: "prize_amount_text_id", type: "int", default: 0 })
  prizeAmountTextId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(
    id: number,
    gameId: number,
    ranking: number,
    rankingTextId: number,
    matchingTextId: number,
    oddsTextId: number,
    prizeAmountTextId: number,
  ) {
    const gameWinningRule = new GameWinningRule();
    gameWinningRule.id = id;
    gameWinningRule.gameId = gameId;
    gameWinningRule.ranking = ranking;
    gameWinningRule.rankingTextId = rankingTextId;
    gameWinningRule.matchingTextId = matchingTextId;
    gameWinningRule.oddsTextId = oddsTextId;
    gameWinningRule.prizeAmountTextId = prizeAmountTextId;
    return gameWinningRule;
  }

  toGameWinningRuleDto() {
    const gameWinningRuleDto = new GameWinningRuleDto();
    gameWinningRuleDto.id = this.id;
    gameWinningRuleDto.gameId = this.gameId;
    gameWinningRuleDto.ranking = this.ranking;
    gameWinningRuleDto.rankingTextId = this.rankingTextId;
    gameWinningRuleDto.matchingTextId = this.matchingTextId;
    gameWinningRuleDto.oddsTextId = this.oddsTextId;
    gameWinningRuleDto.prizeAmountTextId = this.prizeAmountTextId;
    return gameWinningRuleDto;
  }
}
