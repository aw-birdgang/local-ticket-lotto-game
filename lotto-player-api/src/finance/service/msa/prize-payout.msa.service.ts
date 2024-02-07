import { Injectable } from '@nestjs/common';
import {GameKafkaClientService} from "../../../common/microservice/kafka-game-client-service";
import {FilterSort} from "../../../common/microservice/from-search-filter";
import {Pagination, TcpPaginationRequest, TcpRequest} from "../../../common/microservice/tcp-request";
import {TcpPaginationResponse, TcpResponse} from "../../../common/microservice/tcp-response";
import {PrizePayoutDetailDto} from "../../dto/prize-payout-detail.dto";
import {GameMessagePatterns} from "../../../common/microservice/game-message-pattern";

@Injectable()
export class PrizePayoutMsaService {
    constructor(private readonly gameKafkaClientService: GameKafkaClientService) {
    }

    async findPrizePayoutDetailByFilterSort(
        sessionUserId: number,
        filterSort: FilterSort,
        pagination: Pagination,
    ): Promise<TcpPaginationResponse<PrizePayoutDetailDto[]>> {
        const request = TcpPaginationRequest.from<FilterSort>(filterSort, pagination, {sessionUserId});
        return this.gameKafkaClientService.send<TcpPaginationResponse<PrizePayoutDetailDto[]>>(
            GameMessagePatterns.FINANCE_findPrizePayoutDetailByFilterSort,
            request,
        );
    }

    async requestPrizeClaimable(sessionUserId: number, ticketId: string): Promise<PrizePayoutDetailDto> {
        const request = TcpRequest.from<string>(ticketId, {sessionUserId});
        const response = await this.gameKafkaClientService.send<TcpResponse<PrizePayoutDetailDto>>(
            GameMessagePatterns.FINANCE_requestPrizeClaimable,
            request,
        );
        return response.data;
    }
}
