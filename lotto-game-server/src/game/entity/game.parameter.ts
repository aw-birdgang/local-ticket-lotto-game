import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CycleCode } from "./game.enum";

export class GameParameter {
  @ApiProperty()
  @IsNumber()
  gameId: number;

  static from(gameId: number) {
    const parameter = new GameParameter();
    parameter.gameId = gameId;
    return parameter;
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
    const parameter = new RoundParameter();
    parameter.gameId = gameId;
    parameter.turnNumber = turnNumber;
    return parameter;
  }
}

export class RoundCycleParameter {
  @ApiProperty()
  @IsNumber()
  cycleCode: CycleCode;

  static from(cycleCode: CycleCode) {
    const parameter = new RoundCycleParameter();
    parameter.cycleCode = cycleCode;
    return parameter;
  }
}
