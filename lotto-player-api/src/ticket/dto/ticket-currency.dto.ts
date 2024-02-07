import { IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {CurrencyCode} from "../entity/ticket.enum";

export class TicketCurrencyDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ enum: CurrencyCode })
  @IsEnum(CurrencyCode)
  currencyCode: CurrencyCode;

  @ApiProperty({ type: Number })
  @IsNumber()
  amount: number;
}
