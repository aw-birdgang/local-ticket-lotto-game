import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SaveGameBaseInfoLanguageDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  introduction: string;

  @ApiProperty()
  @IsString()
  salePeriodText: string;

  @ApiProperty()
  @IsString()
  drawDateText: string;

  @ApiProperty()
  @IsString()
  ticketPriceText: string;
}
