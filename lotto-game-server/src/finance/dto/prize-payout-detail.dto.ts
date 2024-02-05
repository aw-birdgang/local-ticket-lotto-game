import { ApiProperty } from "@nestjs/swagger";
import { PrizePayoutDto } from "./prize-payout.dto";
import {WinningTicketDetailDto} from "../../ticket/dto/winning-ticket-detail.dto";

export class PrizePayoutDetailDto {
  @ApiProperty({ type: PrizePayoutDto })
  prizePayoutDto: PrizePayoutDto;

  @ApiProperty({ type: WinningTicketDetailDto })
  winningTicketDetailDto: WinningTicketDetailDto;

  static from(prizePayoutDto: PrizePayoutDto, winningTicketDetailDto: WinningTicketDetailDto) {
    const newClass = new PrizePayoutDetailDto();
    newClass.prizePayoutDto = prizePayoutDto;
    newClass.winningTicketDetailDto = winningTicketDetailDto;
    return newClass;
  }
}
