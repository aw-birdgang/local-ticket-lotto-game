import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {PrizeStatus} from "../../finance/entity/finance.enum";

export class WinningTicketDto {
  @ApiProperty({ type: String })
  @IsString()
  ticketId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  ownerId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  roundId: number;

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
