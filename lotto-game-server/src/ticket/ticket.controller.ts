import {Controller} from '@nestjs/common';
import {TicketService} from "./service/ticket.service";
import {MessagePattern, Transport} from "@nestjs/microservices";
import {TicketTcpCommands} from "../common/microservice/MicroserviceTcpClient";
import {TcpResponse} from "../common/microservice/TcpResponse";
import {BundleTicketService} from "./service/bundle-ticket.service";
import {BundleTicketDetailsDto} from "./dto/bundle-ticket-details.dto";

@Controller('ticket')
export class TicketController {
    constructor(
        private readonly ticketService: TicketService,
        private readonly bundleTicketService: BundleTicketService,
    ) {}

    /**
     * 번들 티켓상세 조회
     * @param ticketId
     */
    @MessagePattern({ cmd: TicketTcpCommands.TICKET_BUNDLE_DETAILS_BY_ID }, Transport.TCP)
    async findBundleTicketDetailById(bundleTicketId: string): Promise<TcpResponse<BundleTicketDetailsDto>> {
        const response = await this.bundleTicketService.findBundleTicketDetailById(bundleTicketId);
        return TcpResponse.from(response);
    }

}
