import { IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {AssetType} from "../entity/finance.enum";

export class DepositDto {
  @ApiProperty()
  @IsNumber()
  buyerId: number;

  @ApiProperty()
  @IsEnum(AssetType)
  assetType: AssetType;

  @ApiProperty()
  @IsNumber()
  amount: number;

  static from(buyerId: number, assetType: AssetType, amount: number) {
    const newClass = new DepositDto();
    newClass.buyerId = buyerId;
    newClass.assetType = assetType;
    newClass.amount = amount;
    return newClass;
  }
}
