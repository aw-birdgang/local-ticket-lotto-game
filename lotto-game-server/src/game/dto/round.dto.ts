import { IsDate, IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {CycleCode, RoundStatus} from "../entity/game.enum";

export class RoundDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  gameId: number;

  @ApiProperty()
  @IsNumber()
  turnNumber: number;

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsEnum(RoundStatus)
  status: RoundStatus;

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
  @IsEnum(CycleCode)
  cycleCode: CycleCode;
}
