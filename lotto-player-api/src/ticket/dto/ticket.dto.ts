import { IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {TicketStatus} from "../entity/ticket.enum";

export class TicketDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

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
}
