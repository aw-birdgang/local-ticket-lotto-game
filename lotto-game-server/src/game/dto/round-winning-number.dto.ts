import { IsDate, IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {CycleCode, RoundStatus} from "../entity/game.enum";

export class RoundWinningNumberDto {
  @ApiProperty()
  @IsNumber()
  roundId: number;

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
  roundStatus: RoundStatus;

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

  @ApiProperty()
  @IsNumber()
  winningBall1: number;

  @ApiProperty()
  @IsNumber()
  winningBall2: number;

  @ApiProperty()
  @IsNumber()
  winningBall3: number;

  @ApiProperty()
  @IsNumber()
  winningBall4: number;

  @ApiProperty()
  @IsNumber()
  winningBall5: number;

  @ApiProperty()
  @IsNumber()
  winningBall6: number;

  @ApiProperty()
  @IsNumber()
  winningBallBonus: number;
}
