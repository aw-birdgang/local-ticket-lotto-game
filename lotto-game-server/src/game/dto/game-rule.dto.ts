import {IsDate, IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class GameRuleDto {
  @ApiProperty()
  @IsNumber()
  gameId: number;

  @ApiProperty()
  @IsDate()
  saleStartDate: Date;

  @ApiProperty()
  @IsDate()
  saleEndDate: Date;

  @ApiProperty()
  @IsDate()
  drawStartDate: Date;

  @ApiProperty()
  @IsDate()
  drawEndDate: Date;

  @ApiProperty()
  @IsDate()
  settlingStartDate: Date;

  @ApiProperty()
  @IsDate()
  settlingEndDate: Date;

  @ApiProperty()
  @IsDate()
  prizeStartDate: Date;

  @ApiProperty()
  @IsDate()
  prizeEndDate: Date;

  @ApiProperty()
  @IsNumber()
  ticketCurrencyId: number;
}
