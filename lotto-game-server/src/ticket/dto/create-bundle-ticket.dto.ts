import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBundleTicketDto {
  @ApiProperty({ type: String })
  @IsString()
  bundleTicketId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  ownerId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  gameId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  turnNumber: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ticketQuantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  assetTransactionId: number;
}
