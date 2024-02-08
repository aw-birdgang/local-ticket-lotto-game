import { IsBoolean, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SettingDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsBoolean()
  advertisingEmail: boolean;
}
