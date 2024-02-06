import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EmptyTicketDto {
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
  ticketCurrencyId: number;
}
