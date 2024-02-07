import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {PayoutStatus, PrizeType} from "../entity/finance.enum";
import {RoundDto} from "../../round/dto/round.dto";
import {PlayerUserDto} from "../../account/dto/player-user.dto";
import {TicketIssueCurrencyDto} from "../../ticket/dto/ticket-issue-currency.dto";

export class TicketPrizePayoutDto {
  @ApiProperty({ type: String })
  @IsString()
  ticketId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  roundId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ranking: number;

  @ApiProperty({ type: Date })
  @IsDate()
  expireDate: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  ownerId: number;

  @ApiProperty({ type: Date })
  @IsDate()
  requestDate: Date;

  @ApiProperty({ enum: PrizeType })
  @IsEnum(PrizeType)
  prizeType: PrizeType;

  @ApiProperty({ type: Date })
  @IsDate()
  claimDate: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  prizeAmount: number;

  @ApiProperty({ enum: PayoutStatus })
  @IsEnum(PayoutStatus)
  payoutStatus: PayoutStatus;

  @ApiProperty({ type: Date })
  @IsDate()
  payoutDate: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  managerId: number;

  @ApiProperty({ type: RoundDto })
  roundDto: RoundDto;

  @ApiProperty({ type: PlayerUserDto })
  ownerDto: PlayerUserDto;

  @ApiProperty({ type: TicketIssueCurrencyDto })
  ticketIssueCurrencyDto: TicketIssueCurrencyDto;
}
