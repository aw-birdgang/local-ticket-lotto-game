import { IsBoolean, IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {PayoutStatus, PrizeType} from "../entity/finance.enum";

export class PrizePayoutDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ enum: PrizeType })
  @IsEnum(PrizeType)
  prizeType: PrizeType;

  @ApiProperty({ type: Date })
  @IsDate()
  requestDate: Date;

  @ApiProperty({ type: String })
  @IsString()
  ticketId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  playerId: number;

  @ApiProperty({ enum: PayoutStatus })
  @IsEnum(PayoutStatus)
  payoutStatus: PayoutStatus;

  @ApiProperty({ type: Number })
  @IsNumber()
  managerId: number;

  @ApiProperty({ type: Date })
  @IsDate()
  confirmDate: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  confirmYn: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  superManagerId: number;

  @ApiProperty({ type: Date })
  @IsDate()
  payoutDate: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  payoutYn: boolean;
}
