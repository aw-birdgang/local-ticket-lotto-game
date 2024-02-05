import { IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {AssetType, OrderType} from "../entity/finance.enum";

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
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty()
  @IsString()
  orderId: string;

  static from(buyerId: number, assetType: AssetType, amount: number, orderType: OrderType, orderId: string) {
    const newClass = new BuyTicketDto();
    newClass.buyerId = buyerId;
    newClass.assetType = assetType;
    newClass.amount = amount;
    newClass.orderType = orderType;
    newClass.orderId = orderId;
    return newClass;
  }
}
