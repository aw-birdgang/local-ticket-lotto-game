import { IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AssetType } from "./finance.enum";

export class AssetParameter {
  @ApiProperty()
  @IsNumber()
  ownerId: number;

  @ApiProperty()
  @IsEnum(AssetType)
  assetType: AssetType;

  static from(ownerId: number, assetType: AssetType) {
    const parameter = new AssetParameter();
    parameter.ownerId = ownerId;
    parameter.assetType = assetType;
    return parameter;
  }
}
