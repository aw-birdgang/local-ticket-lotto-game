import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber } from "class-validator";

export class BatchJobDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  workerId: number;

  @ApiProperty()
  @IsDate()
  registrationDate: Date;

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsNumber()
  roundId: number;

  @ApiProperty()
  @IsNumber()
  ruleId: number;
}
