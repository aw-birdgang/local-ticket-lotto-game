import { IsEnum, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {GameStatus} from "../entity/game.enum";

export class GameLanguageDto {
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

  @ApiProperty()
  @IsEnum(GameStatus)
  status: GameStatus;

  static new(gameLanguageDto: GameLanguageDto) {
    const newClass = new GameLanguageDto();
    newClass.id = gameLanguageDto.id;
    newClass.name = gameLanguageDto.name;
    newClass.introduction = gameLanguageDto.introduction;
    newClass.salePeriodText = gameLanguageDto.salePeriodText;
    newClass.drawDateText = gameLanguageDto.drawDateText;
    newClass.ticketPriceText = gameLanguageDto.ticketPriceText;
    newClass.status = gameLanguageDto.status;
    return newClass;
  }
}
