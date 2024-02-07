import {Body, Controller, HttpCode, HttpStatus, Post, Req} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {TicketMsaService} from "../service/ticket.msa.service";
import {TicketDetailsDto} from "../dto/ticket-deteils.dto";
import {CreateIssuingTicketDto} from "../dto/create-issuing-ticket.dto";

@ApiBearerAuth("KpxBearerAuth")
@ApiTags("Ticket")
@Controller("private/ticket")
export class TicketController {
    constructor(private ticketMsService: TicketMsaService) {}

    @ApiOperation({ summary: "싱글 티켓 발권" })
    @ApiOkResponse({
        type: TicketDetailsDto,
        description: "200. Success. Returns a ticket issuance",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. ticket issuance was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: CreateIssuingTicketDto })
    @Post("tickets/ticket-issuance")
    async issuingTicket(@Req() request: Request, @Body() issuingTicket: CreateIssuingTicketDto): Promise<TicketDetailsDto> {
        const { sub: userId } = request["user"];
        console.log("issuingTicket  issuingTicket -> ", issuingTicket);
        const response = await this.ticketMsService.issuingTicket(userId, issuingTicket);
        return response.data;
    }

    @ApiOperation({ summary: "멀티 티켓 발권" })
    @ApiOkResponse({
        type: [TicketDetailsDto],
        description: "200. Success. Returns a lotto winning ticket",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. WinningTicket was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: [CreateIssuingTicketDto] })
    @Post("tickets/multi-ticket-issuance")
    async multiTicketIssuance(@Req() request: Request, @Body() ticketIssuanceList: CreateIssuingTicketDto[]): Promise<TicketDetailsDto[]> {
        const { sub: userId } = request["user"];
        const response = await this.ticketMsService.bundleTicketIssuance(userId, ticketIssuanceList);
        return response.data;
    }
}
