import { IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {AssetType} from "../entity/finance.enum";

export class BuyTicketDto {
  @ApiProperty()
  @IsNumber()
  buyerId: number;

  @ApiProperty()
  @IsEnum(AssetType)
  assetType: AssetType;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  orderId: number;

  static from(buyerId: number, assetType: AssetType, amount: number, orderId: number) {
    const newClass = new BuyTicketDto();
    newClass.buyerId = buyerId;
    newClass.assetType = assetType;
    newClass.amount = amount;
    newClass.orderId = orderId;
    return newClass;
  }
}
