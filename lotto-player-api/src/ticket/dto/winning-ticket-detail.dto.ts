import { ApiProperty } from "@nestjs/swagger";
import { TicketIssueWinningCurrencyDto } from "./ticket-issue-winning-currency.dto";
import {RoundWinningNumberDto} from "../../round/dto/round-winning-number.dto";
import {PlayerUserDto} from "../../account/dto/player-user.dto";

export class WinningTicketDetailDto {
  @ApiProperty({ type: TicketIssueWinningCurrencyDto })
  ticketIssueWinningCurrencyDto: TicketIssueWinningCurrencyDto;

  @ApiProperty({ type: RoundWinningNumberDto })
  roundWinningNumberDto: RoundWinningNumberDto;

  @ApiProperty({ type: PlayerUserDto })
  ownerDto: PlayerUserDto;

  static from(
    ticketIssueWinningCurrencyDto: TicketIssueWinningCurrencyDto,
    roundWinningNumberDto: RoundWinningNumberDto,
    ownerDto: PlayerUserDto,
  ) {
    const newClass = new WinningTicketDetailDto();
    newClass.ticketIssueWinningCurrencyDto = ticketIssueWinningCurrencyDto;
    newClass.roundWinningNumberDto = roundWinningNumberDto;
    newClass.ownerDto = ownerDto;
    return newClass;
  }
}
