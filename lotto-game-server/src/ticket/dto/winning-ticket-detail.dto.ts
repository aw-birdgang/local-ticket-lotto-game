import { ApiProperty } from "@nestjs/swagger";
import { TicketIssueWinningCurrencyDto } from "./ticket-issue-winning-currency.dto";
import {RoundWinningNumberDto} from "../../game/dto/round-winning-number.dto";
import {PlayerDto} from "../../player/dto/player.dto";

export class WinningTicketDetailDto {
  @ApiProperty({ type: TicketIssueWinningCurrencyDto })
  ticketIssueWinningCurrencyDto: TicketIssueWinningCurrencyDto;

  @ApiProperty({ type: RoundWinningNumberDto })
  roundWinningNumberDto: RoundWinningNumberDto;

  @ApiProperty({ type: PlayerDto })
  ownerDto: PlayerDto;

  static from(
    ticketIssueWinningCurrencyDto: TicketIssueWinningCurrencyDto,
    roundWinningNumberDto: RoundWinningNumberDto,
    ownerDto: PlayerDto,
  ) {
    const newClass = new WinningTicketDetailDto();
    newClass.ticketIssueWinningCurrencyDto = ticketIssueWinningCurrencyDto;
    newClass.roundWinningNumberDto = roundWinningNumberDto;
    newClass.ownerDto = ownerDto;
    return newClass;
  }
}
