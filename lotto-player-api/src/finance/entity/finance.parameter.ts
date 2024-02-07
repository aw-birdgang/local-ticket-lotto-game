import { IsEnum, IsNumber, IsString } from "class-validator";
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

export class PrizeClaimParameter {
  @ApiProperty()
  @IsString()
  ticketId: string;

  static from(ticketId: string) {
    const parameter = new PrizeClaimParameter();
    parameter.ticketId = ticketId;
    return parameter;
  }
}
