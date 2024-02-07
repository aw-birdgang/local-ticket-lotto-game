import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class BatchRoundAggregationDto {
  @ApiProperty()
  @IsNumber()
  batchJobId: number;

  @ApiProperty()
  @IsNumber()
  totalTicketQuantity: number;

  @ApiProperty()
  @IsNumber()
  totalTicketAmount: number;

  @ApiProperty()
  @IsNumber()
  totalPrizeAmount: number;

  @ApiProperty()
  @IsNumber()
  totalDonationAmount: number;

  @ApiProperty()
  @IsNumber()
  totalCommissionAmount: number;

  @ApiProperty()
  @IsNumber()
  totalOperatingAmount: number;
}
