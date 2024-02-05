import { ApiProperty } from "@nestjs/swagger";
import { TicketDto } from "./ticket.dto";
import { IssuedTicketDto } from "./issued-ticket.dto";
import { WinningTicketDto } from "./winning-ticket.dto";
import { isEmpty, isNotEmpty } from "class-validator";
import { BundleTicketDto } from "./bundle-ticket.dto";
import {TicketCurrencyDto} from "./ticket-currency.dto";
import {PlayerDto} from "../../player/dto/player.dto";
import {RoundDto} from "../../game/dto/round.dto";

export class TicketDetailsDto {
  @ApiProperty()
  ticketDto: TicketDto;

  @ApiProperty()
  ticketCurrencyDto: TicketCurrencyDto;

  @ApiProperty()
  issuedTicketDto: IssuedTicketDto;

  @ApiProperty()
  winningTicketDto: WinningTicketDto;

  @ApiProperty()
  roundDto: RoundDto;

  @ApiProperty()
  playerDto: PlayerDto;

  @ApiProperty()
  bundleTicketDto: BundleTicketDto[];

  static from(
    ticketDto: TicketDto,
    ticketCurrencyDto: TicketCurrencyDto,
    issuedTicketDto: IssuedTicketDto,
    winningTicketDto: WinningTicketDto,
    roundDto?: RoundDto,
    playerDto?: PlayerDto,
    bundleTicketDto?: BundleTicketDto[],
  ) {
    if (isEmpty(ticketDto)) {
      return null;
    }
    const ticketDetailsDto = new TicketDetailsDto();
    ticketDetailsDto.ticketDto = ticketDto;
    if (isNotEmpty(ticketCurrencyDto)) {
      ticketDetailsDto.ticketCurrencyDto = ticketCurrencyDto;
    }
    if (isNotEmpty(issuedTicketDto)) {
      ticketDetailsDto.issuedTicketDto = issuedTicketDto;
    }
    if (isNotEmpty(winningTicketDto)) {
      ticketDetailsDto.winningTicketDto = winningTicketDto;
    }
    if (isNotEmpty(playerDto)) {
      ticketDetailsDto.playerDto = playerDto;
    }
    if (isNotEmpty(roundDto)) {
      ticketDetailsDto.roundDto = roundDto;
    }
    if (isNotEmpty(bundleTicketDto)) {
      ticketDetailsDto.bundleTicketDto = bundleTicketDto;
    }
    return ticketDetailsDto;
  }
}
