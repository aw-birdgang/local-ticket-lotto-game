import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AssetBalanceDto {
  @ApiProperty()
  @IsNumber()
  ownerId: number;

  @ApiProperty()
  @IsNumber()
  balance: number;
}
