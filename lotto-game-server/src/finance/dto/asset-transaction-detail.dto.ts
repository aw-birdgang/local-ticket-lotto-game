import { ApiProperty } from "@nestjs/swagger";
import { AssetTransactionDto } from "./asset-transaction.dto";
import { AssetOwnerDto } from "./asset-owner.dto";

export class AssetTransactionDetailDto {
  @ApiProperty({ type: AssetTransactionDto })
  assetTransactionDto: AssetTransactionDto;

  @ApiProperty({ type: AssetOwnerDto })
  assetOwnerDto: AssetOwnerDto;

  static from(assetTransactionDto: AssetTransactionDto, assetOwnerDto: AssetOwnerDto) {
    const newClass = new AssetTransactionDetailDto();
    newClass.assetTransactionDto = assetTransactionDto;
    newClass.assetOwnerDto = assetOwnerDto;
    return newClass;
  }
}
