import { IsDate, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BundleTicketDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  ownerId: number;

  @ApiProperty({ type: Date })
  @IsDate()
  purchaseDate: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  ticketQuantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ticketAmount: number;
}
