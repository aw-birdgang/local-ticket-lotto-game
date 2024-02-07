import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class WinningNumberDto {
  @ApiProperty()
  @IsNumber()
  roundId: number;

  @ApiProperty()
  @IsNumber()
  ball1: number;

  @ApiProperty()
  @IsNumber()
  ball2: number;

  @ApiProperty()
  @IsNumber()
  ball3: number;

  @ApiProperty()
  @IsNumber()
  ball4: number;

  @ApiProperty()
  @IsNumber()
  ball5: number;

  @ApiProperty()
  @IsNumber()
  ball6: number;

  @ApiProperty()
  @IsNumber()
  ballBonus: number;
}
