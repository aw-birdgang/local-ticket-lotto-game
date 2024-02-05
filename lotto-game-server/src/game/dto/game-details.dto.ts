import { ApiProperty } from "@nestjs/swagger";
import { GameLanguageDto } from "./game-language.dto";
import { GameWinningRuleLanguageDto } from "./game-winning-rule-language.dto";
import {TicketCurrencyDto} from "../../ticket/dto/ticket-currency.dto";

export class GameDetailsDto {
  @ApiProperty()
  gameLanguageDto: GameLanguageDto;

  @ApiProperty()
  gameWinningRuleLanguageList: GameWinningRuleLanguageDto[];

  @ApiProperty()
  ticketCurrencyDto: TicketCurrencyDto;

  static from(
    gameLanguageDto: GameLanguageDto,
    gameWinningRuleLanguageList: GameWinningRuleLanguageDto[],
    ticketCurrencyDto: TicketCurrencyDto,
  ) {
    const gameDetailsDto = new GameDetailsDto();
    gameDetailsDto.gameLanguageDto = gameLanguageDto;
    gameDetailsDto.gameWinningRuleLanguageList = gameWinningRuleLanguageList;
    gameDetailsDto.ticketCurrencyDto = ticketCurrencyDto;
    return gameDetailsDto;
  }
}
