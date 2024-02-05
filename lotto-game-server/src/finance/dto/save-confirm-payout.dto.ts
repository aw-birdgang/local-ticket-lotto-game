import { IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {PrizeType} from "../entity/finance.enum";

export class SaveConfirmPayoutDto {
  @ApiProperty({ enum: PrizeType })
  @IsEnum(PrizeType)
  prizeType: PrizeType;

  @ApiProperty({ type: [Number] })
  prizePayoutIds: [number];

  @ApiProperty({ type: Number })
  @IsNumber()
  managerId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  superManagerId: number;
}

export class BigConfirmPayoutDto {
  @ApiProperty({ type: [Number] })
  prizePayoutIds: [number];

  @ApiProperty({ type: Number })
  @IsNumber()
  managerId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  superManagerId: number;

  toSaveConfirmPayoutDto() {
    const newClass = new SaveConfirmPayoutDto();
    newClass.prizeType = PrizeType.BIG_PRIZE;
    newClass.prizePayoutIds = this.prizePayoutIds;
    newClass.managerId = this.managerId;
    newClass.superManagerId = this.superManagerId;
    return newClass;
  }
}

export class SmallConfirmPayoutDto {
  @ApiProperty({ type: [Number] })
  prizePayoutIds: [number];

  @ApiProperty({ type: Number })
  @IsNumber()
  managerId: number;

  toSaveConfirmPayoutDto() {
    const newClass = new SaveConfirmPayoutDto();
    newClass.prizeType = PrizeType.SMALL_PRIZE;
    newClass.prizePayoutIds = this.prizePayoutIds;
    newClass.managerId = this.managerId;
    newClass.superManagerId = this.managerId;
    return newClass;
  }
}
