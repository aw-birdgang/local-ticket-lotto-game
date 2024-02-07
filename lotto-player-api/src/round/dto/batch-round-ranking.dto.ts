import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class BatchRoundRankingDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  batchJobId: number;

  @ApiProperty()
  @IsNumber()
  ranking: number;

  @ApiProperty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty()
  @IsNumber()
  totalQuantity: number;

  @ApiProperty()
  @IsNumber()
  prizeAmountPerTicket: number;

  @ApiProperty()
  @IsNumber()
  payoutPrizeAmount: number;

  @ApiProperty()
  @IsNumber()
  payoutPrizeQuantity: number;

  @ApiProperty()
  @IsNumber()
  notPayoutPrizeAmount: number;

  @ApiProperty()
  @IsNumber()
  notPayoutPrizeQuantity: number;
}
