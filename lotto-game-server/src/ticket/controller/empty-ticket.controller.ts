import {Controller, Logger} from '@nestjs/common';
import {MessagePattern} from "@nestjs/microservices";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {TcpRequest} from "../../common/microservice/tcp-request";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {EmptyTicketService} from "../service/empty-ticket.service";
import {CreateEmptyTicketDto} from "../dto/create-empty-ticket.dto";

class EmptyTicketDto {
}

@Controller()
export class EmptyTicketController {
    constructor(
        private readonly emptyTicketService: EmptyTicketService
    ) {
    }

    private readonly logger = new Logger(EmptyTicketController.name);


    /**
     * 빈티켓 생성
     * @param request<CreateIssuingTicketDto>
     */
    @MessagePattern(GameMessagePatterns.TICKET_createEmptyTicket)
    async createEmptyTicket(request: TcpRequest<CreateEmptyTicketDto>) {
        this.logger.log("createEmptyTicket  request -> ", request);
        const emptyTicketDto = await this.emptyTicketService.create(request.data);
        return TcpResponse.from<EmptyTicketDto>(emptyTicketDto);
    }

    /**
     * 빈티켓 삭제(soft delete)
     * @param request
     */
    @MessagePattern(GameMessagePatterns.TICKET_deleteEmptyTicket)
    async deleteEmptyTicket(request: TcpRequest<string>) {
        this.logger.log("deleteEmptyTicket  request -> ", request);
        await this.emptyTicketService.delete(request.data);
        return TcpResponse.from<boolean>(true);
    }
}
