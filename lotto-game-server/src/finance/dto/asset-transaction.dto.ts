import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {OrderType, TransactionType} from "../entity/finance.enum";

export class AssetTransactionDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  buyerId: number;

  @ApiProperty()
  @IsNumber()
  assetId: number;

  @ApiProperty()
  @IsDate()
  transactionDate: Date;

  @ApiProperty()
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty()
  @IsString()
  orderId: string;

  static new(assetTransactionDto: AssetTransactionDto) {
    const newClass = new AssetTransactionDto();
    newClass.id = assetTransactionDto.id;
    newClass.buyerId = assetTransactionDto.buyerId;
    newClass.assetId = assetTransactionDto.assetId;
    newClass.transactionDate = assetTransactionDto.transactionDate;
    newClass.amount = assetTransactionDto.amount;
    newClass.orderType = assetTransactionDto.orderType;
    newClass.orderId = assetTransactionDto.orderId;
    return newClass;
  }
}
