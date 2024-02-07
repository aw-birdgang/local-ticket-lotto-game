import { IsDate, IsEnum, IsNumber } from "class-validator";
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
  @IsNumber()
  orderId: number;
}
