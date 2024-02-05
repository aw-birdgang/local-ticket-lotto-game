import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {CurrencyCode, TicketStatus} from "../entity/ticket.enum";
import {PrizeStatus} from "../../finance/entity/finance.enum";

export class TicketIssueWinningCurrencyDto {
  @ApiProperty({ type: String })
  @IsString()
  ticketId: string;

  @ApiProperty({ type: String })
  @IsNumber()
  bundleTicketId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  ownerId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  roundId: number;

  @ApiProperty({ enum: TicketStatus })
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @ApiProperty({ type: Number })
  @IsNumber()
  ticketCurrencyId: number;

  @ApiProperty({ enum: CurrencyCode })
  @IsEnum(CurrencyCode)
  currencyCode: CurrencyCode;

  @ApiProperty({ type: Number })
  @IsNumber()
  ticketCurrencyAmount: number;

  @ApiProperty({ type: Date })
  @IsDate()
  issueDate: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball1: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball2: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball3: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball4: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball5: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball6: number;

  @ApiProperty({ type: Date })
  @IsDate()
  expireDate: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  ranking: number;

  @ApiProperty({ type: Date })
  @IsDate()
  claimDate: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  prizeAmount: number;

  @ApiProperty({ enum: PrizeStatus })
  @IsEnum(PrizeStatus)
  prizeStatus: PrizeStatus;
}
