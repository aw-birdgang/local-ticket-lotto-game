import {ApiProperty} from "@nestjs/swagger";
import {TicketIssueWinningCurrencyDto} from "./ticket-issue-winning-currency.dto";
import {RoundWinningNumberDto} from "../../game/dto/round-winning-number.dto";

export class WinningTicketDetailDto {
  @ApiProperty({ type: TicketIssueWinningCurrencyDto })
  ticketIssueWinningCurrencyDto: TicketIssueWinningCurrencyDto;

  @ApiProperty({ type: RoundWinningNumberDto })
  roundWinningNumberDto: RoundWinningNumberDto;

  static from(
      ticketIssueWinningCurrencyDto: TicketIssueWinningCurrencyDto,
      roundWinningNumberDto: RoundWinningNumberDto,
  ) {
    const newClass = new WinningTicketDetailDto();
    newClass.ticketIssueWinningCurrencyDto = ticketIssueWinningCurrencyDto;
    newClass.roundWinningNumberDto = roundWinningNumberDto;
    return newClass;
  }
}
