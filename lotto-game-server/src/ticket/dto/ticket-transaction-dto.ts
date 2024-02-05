import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, IsDate } from "class-validator";

export class TicketTransactionDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  transactionId: number;

  @ApiProperty({ type: String })
  @IsEmail()
  player: string;

  @ApiProperty({ type: Date })
  @IsDate()
  transactionDate: Date;

  @ApiProperty({ type: String })
  @IsString()
  transactionType: string;

  @ApiProperty({ type: String })
  @IsString()
  orderNumber: string | null;
}
