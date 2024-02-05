import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LanguageKeyDto {
  @ApiProperty()
  @IsNumber()
  languageId: number;

  @ApiProperty()
  @IsString()
  tableName: string;

  @ApiProperty()
  @IsString()
  columnName: string;
}
