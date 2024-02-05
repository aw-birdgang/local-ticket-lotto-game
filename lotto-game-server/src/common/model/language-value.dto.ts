import { IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LanguageCode } from "./common.enum";

export class LanguageValueDto {
  @ApiProperty()
  @IsNumber()
  languageId: number;

  @ApiProperty()
  @IsEnum(LanguageCode)
  languageCode: LanguageCode;

  @ApiProperty()
  @IsString()
  text: string;
}
