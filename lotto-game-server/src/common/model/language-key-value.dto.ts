import { IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LanguageCode } from "./common.enum";

export class LanguageKeyValueDto {
  @ApiProperty()
  @IsNumber()
  languageId: number;

  @ApiProperty()
  @IsString()
  tableName: string;

  @ApiProperty()
  @IsString()
  columnName: string;

  @ApiProperty()
  @IsEnum(LanguageCode)
  languageCode: LanguageCode;

  @ApiProperty()
  @IsString()
  text: string;

  static from(languageId: number, tableName: string, columnName: string, languageCode: LanguageCode, text: string) {
    const languageKeyValueDto = new LanguageKeyValueDto();
    languageKeyValueDto.languageId = languageId;
    languageKeyValueDto.tableName = tableName;
    languageKeyValueDto.columnName = columnName;
    languageKeyValueDto.languageCode = languageCode;
    languageKeyValueDto.text = text;
    return languageKeyValueDto;
  }
}
