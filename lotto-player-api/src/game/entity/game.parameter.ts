import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GameParameter {
  @ApiProperty()
  @IsNumber()
  gameId: number;

  static from(gameId: number) {
    const gameParameter = new GameParameter();
    gameParameter.gameId = gameId;
    return gameParameter;
  }
}

export class RoundParameter {
  @ApiProperty()
  @IsNumber()
  gameId: number;

  @ApiProperty()
  @IsNumber()
  turnNumber: number;

  static from(gameId: number, turnNumber: number) {
    const roundParameter = new RoundParameter();
    roundParameter.gameId = gameId;
    roundParameter.turnNumber = turnNumber;
    return roundParameter;
  }
}
