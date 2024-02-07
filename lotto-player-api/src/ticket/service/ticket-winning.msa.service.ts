import { Injectable } from '@nestjs/common';
import {GameKafkaClientService} from "../../common/microservice/kafka-game-client-service";
import {FilterSort} from "../../common/microservice/from-search-filter";
import {Pagination, TcpPaginationRequest} from "../../common/microservice/tcp-request";
import {WinningTicketDetailDto} from "../dto/winning-ticket-detail.dto";
import {TcpPaginationResponse} from "../../common/microservice/tcp-response";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";

@Injectable()
export class TicketWinningMsaService {
    constructor(private readonly gameKafkaClientService: GameKafkaClientService) {
    }

    async findWinningTicketDetailByFilterSort(
        sessionUserId: number,
        filterSort: FilterSort,
        pagination: Pagination,
    ): Promise<TcpPaginationResponse<WinningTicketDetailDto[]>> {
        const request = TcpPaginationRequest.from<FilterSort>(filterSort, pagination, {sessionUserId});
        return this.gameKafkaClientService.send<TcpPaginationResponse<WinningTicketDetailDto[]>>(
            GameMessagePatterns.TICKET_findWinningTicketDetailByFilterSort,
            request,
        );
    }
}
