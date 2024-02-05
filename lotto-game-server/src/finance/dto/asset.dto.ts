import { IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {AssetType} from "../entity/finance.enum";

export class AssetDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsEnum(AssetType)
  assetType: AssetType;

  @ApiProperty()
  @IsNumber()
  ownerId: number;

  @ApiProperty()
  @IsNumber()
  balance: number;
}
