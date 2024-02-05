import { IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {GameStatus} from "../entity/game.enum";

export class GameDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  nameId: number;

  @ApiProperty()
  @IsNumber()
  introductionId: number;

  @ApiProperty()
  @IsNumber()
  salePeriodId: number;

  @ApiProperty()
  @IsNumber()
  drawDateId: number;

  @ApiProperty()
  @IsNumber()
  ticketPriceId: number;

  @ApiProperty()
  @IsEnum(GameStatus)
  status: GameStatus;
}
