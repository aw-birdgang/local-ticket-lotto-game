import { ApiProperty } from "@nestjs/swagger";
import { isEmpty, isNotEmpty } from "class-validator";
import { BundleTicketDto } from "./bundle-ticket.dto";
import { TicketDetailsDto } from "./ticket-deteils.dto";
import {RoundDto} from "../../game/dto/round.dto";

export class BundleTicketDetailsDto {
  @ApiProperty()
  bundleTicketDto: BundleTicketDto;

  @ApiProperty()
  ticketDetailList: TicketDetailsDto[];

  @ApiProperty()
  roundDto: RoundDto;

  static from(bundleTicketDto: BundleTicketDto, ticketDetailList: TicketDetailsDto[], roundDto?: RoundDto) {
    if (isEmpty(bundleTicketDto)) {
      return null;
    }
    const bundleTicketDetailsDto = new BundleTicketDetailsDto();
    bundleTicketDetailsDto.bundleTicketDto = bundleTicketDto;
    if (isNotEmpty(ticketDetailList)) {
      bundleTicketDetailsDto.ticketDetailList = ticketDetailList;
    }
    if (isNotEmpty(roundDto)) {
      bundleTicketDetailsDto.roundDto = roundDto;
    }
    return bundleTicketDetailsDto;
  }
}
