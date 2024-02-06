import {Controller, Logger} from '@nestjs/common';
import {WinningTicketService} from "../service/winning-ticket.service";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {MessagePattern} from "@nestjs/microservices";
import {FilterSort} from "../../common/microservice/from-search-filter";
import {TcpPaginationRequest} from "../../common/microservice/tcp-request";
import {WinningTicketDetailDto} from "../dto/winning-ticket-detail.dto";
import {TcpPaginationResponse} from "../../common/microservice/tcp-response";
import {isEmpty} from "class-validator";
import {ErrorCodes} from "../../common/exception/error.enum";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";

@Controller()
export class WinningTicketController {
    constructor(private readonly winningTicketService: WinningTicketService) {
    }

    private readonly logger = new Logger(WinningTicketController.name);

    @MessagePattern(GameMessagePatterns.TICKET_findWinningTicketDetailByFilterSort)
    async findWinningTicketDetailByFilterSort(
        request: TcpPaginationRequest<FilterSort>
    ): Promise<TcpPaginationResponse<WinningTicketDetailDto[]>> {
        this.logger.log("findWinningTicketDetailByFilterSort  -> ", request);
        const sessionUserId = request.headers["sessionUserId"];
        if (isEmpty(sessionUserId)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_005);
        }
        return await this.winningTicketService.findByFilterSort(request.data, request.pagination);
    }
}
