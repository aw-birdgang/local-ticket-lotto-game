import { IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {AssetType} from "../entity/finance.enum";

export class CreateAssetDto {
  @ApiProperty()
  @IsEnum(AssetType)
  assetType: AssetType;

  @ApiProperty()
  @IsNumber()
  ownerId: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  static from(ownerId: number, assetType: AssetType, amount: number) {
    const newClass = new CreateAssetDto();
    newClass.ownerId = ownerId;
    newClass.assetType = assetType;
    newClass.amount = amount;
    return newClass;
  }
}
