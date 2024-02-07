import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class GameWinningRuleDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  gameId: number;

  @ApiProperty()
  @IsNumber()
  ranking: number;

  @ApiProperty()
  @IsNumber()
  rankingTextId: number;

  @ApiProperty()
  @IsNumber()
  matchingTextId: number;

  @ApiProperty()
  @IsNumber()
  oddsTextId: number;

  @ApiProperty()
  @IsNumber()
  prizeAmountTextId: number;
}
