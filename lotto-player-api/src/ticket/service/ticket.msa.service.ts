import { Injectable } from '@nestjs/common';
import {TcpPaginationResponse, TcpResponse} from "../../common/microservice/tcp-response";
import {GameKafkaClientService} from "../../common/microservice/kafka-game-client-service";
import {TicketDetailsDto} from "../dto/ticket-deteils.dto";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {FilterSort} from "../../common/microservice/from-search-filter";
import {Pagination, TcpPaginationRequest, TcpRequest} from "../../common/microservice/tcp-request";
import {PurchaseTicketListDto} from "../dto/purchase-ticket-list.dto";
import {CreateIssuingTicketDto} from "../dto/create-issuing-ticket.dto";

@Injectable()
export class TicketMsaService {
    constructor(private readonly gameKafkaClientService: GameKafkaClientService) {
    }

    async findBundleTicketDetailById(bundleTicketId: string): Promise<TcpResponse<TicketDetailsDto>> {
        return this.gameKafkaClientService.send<TcpResponse<TicketDetailsDto>>(
            GameMessagePatterns.TICKET_findBundleTicketDetailById,
            bundleTicketId,
        );
    }

    async findTicketDetailPaginationByOwnerId(
        ownerId: number,
        filterSort: FilterSort,
        pagination: Pagination,
    ): Promise<TcpPaginationResponse<PurchaseTicketListDto[]>> {
        const headers = {userId: ownerId};
        const request = TcpPaginationRequest.from<FilterSort>(filterSort, pagination, headers);
        return this.gameKafkaClientService.send<TcpPaginationResponse<PurchaseTicketListDto[]>>(
            GameMessagePatterns.TICKET_findTicketDetailPaginationByOwnerId,
            request,
        )
            ;
    }

    issuingTicket(userId: number, issuingTicket: CreateIssuingTicketDto) {
        const headers = {userId};
        issuingTicket.ownerId = userId;
        const request = TcpRequest.from<CreateIssuingTicketDto>(issuingTicket, headers);
        return this.gameKafkaClientService.send<TcpResponse<TicketDetailsDto>>(
            GameMessagePatterns.TICKET_createIssuedTicket,
            request
        );
    }

    bundleTicketIssuance(userId: number, ticketIssuanceList: CreateIssuingTicketDto[]) {
        const headers = {userId};
        const request = TcpRequest.from<CreateIssuingTicketDto[]>(ticketIssuanceList, headers);
        return this.gameKafkaClientService.send<TcpResponse<TicketDetailsDto[]>>(
            GameMessagePatterns.TICKET_createBundleIssuedTicket,
            request
        );
    }

    async findOngoingTicketByOwnerId(
        ownerId: number,
        filterSort: FilterSort,
        pagination: Pagination,
    ): Promise<TcpPaginationResponse<TicketDetailsDto[]>> {
        const headers = {userId: ownerId};
        const request = TcpPaginationRequest.from<FilterSort>(filterSort, pagination, headers);
        return this.gameKafkaClientService.send<TcpPaginationResponse<TicketDetailsDto[]>>(
            GameMessagePatterns.TICKET_findOngoingTicketByOwnerId,
            request,
        );
    }

    async findWinningTicketByOwnerId(ownerId: number, page: number, offset: number): Promise<TcpPaginationResponse<TicketDetailsDto>> {
        const headers = {userId: ownerId};
        const request = TcpPaginationRequest.from<number>(ownerId, Pagination.from(page, offset), headers);
        return this.gameKafkaClientService.send<TcpPaginationResponse<TicketDetailsDto>>(
            GameMessagePatterns.TICKET_findOngoingTicketByOwnerId,
            request
        );
    }
}
