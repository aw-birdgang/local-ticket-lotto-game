import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GameWinningRuleLanguageDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  id: number;

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
