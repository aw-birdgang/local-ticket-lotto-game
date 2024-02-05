import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class SaveGameWinningRuleLanguageDto {
  @ApiProperty()
  @IsNumber()
  gameId: number;

  @ApiProperty()
  @IsNumber()
  ranking: number;

  @ApiProperty()
  @IsString()
  rankingText: string;

  @ApiProperty()
  @IsString()
  matchingText: string;

  @ApiProperty()
  @IsString()
  oddsText: string;

  @ApiProperty()
  @IsString()
  prizeAmountText: string;
}
