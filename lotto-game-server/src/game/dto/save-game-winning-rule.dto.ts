import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { SaveGameWinningRuleLanguageDto } from "./save-game-winning-rule-language.dto";

export class SaveGameWinningRuleDto {
  @ApiProperty()
  @IsNumber()
  gameId: number;

  @ApiProperty()
  saveGameWinningRuleLanguageList: SaveGameWinningRuleLanguageDto[];

  static from(gameId: number, gameWinningRuleLanguageList: SaveGameWinningRuleLanguageDto[]) {
    const saveGameWinningRuleDto = new SaveGameWinningRuleDto();
    saveGameWinningRuleDto.gameId = gameId;
    saveGameWinningRuleDto.saveGameWinningRuleLanguageList = gameWinningRuleLanguageList;
    return saveGameWinningRuleDto;
  }
}
