import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsIn, IsArray } from "class-validator";

export class PurchaseTicketListDto {
  @ApiProperty({ type: Date })
  @IsDate()
  purchaseDate: Date;

  @ApiProperty({ type: String })
  @IsNumber()
  amount: number;

  @ApiProperty({ type: String })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: String })
  @IsArray()
  @IsIn(["win", "lose"])
  winlose: ("win" | "lose")[];

  @ApiProperty({ type: String })
  @IsNumber()
  drawNumber: number;

  @ApiProperty({ type: Date })
  @IsDate()
  drawDate: Date;
}
