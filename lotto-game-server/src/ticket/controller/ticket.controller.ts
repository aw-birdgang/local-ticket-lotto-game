import {Controller, Logger} from '@nestjs/common';
import {TicketService} from "../service/ticket.service";
import {MessagePattern, Transport} from "@nestjs/microservices";
import {BundleTicketService} from "../service/bundle-ticket.service";
import {BundleTicketDetailsDto} from "../dto/bundle-ticket-details.dto";
import {TcpPaginationResponse, TcpResponse} from "../../common/microservice/tcp-response";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {TcpPaginationRequest, TcpRequest} from "../../common/microservice/tcp-request";
import {TicketDetailsDto} from "../dto/ticket-deteils.dto";
import {FilterSort, SearchFilterSort} from "../../common/microservice/from-search-filter";
import {PurchaseTicketListDto} from "../dto/purchase-ticket-list.dto";
import {CreateIssuingTicketDto} from "../dto/create-issuing-ticket.dto";
import {Ticket} from "../entity/ticket.entity";
import {TicketTransactionDto} from "../dto/ticket-transaction-dto";
import {TotalTicketListDto} from "../dto/total-ticket-list.dto";

@Controller()
export class TicketController {
    constructor(
        private readonly ticketService: TicketService,
        private readonly bundleTicketService: BundleTicketService,
    ) {}

    private readonly logger = new Logger(TicketController.name);

    /**
     * 번들 티켓상세 조회
     * @param bundleTicketId
     */
    @MessagePattern(GameMessagePatterns.TICKET_findBundleTicketDetailById)
    async findBundleTicketDetailById(bundleTicketId: string): Promise<TcpResponse<BundleTicketDetailsDto>> {
        const response = await this.bundleTicketService.findBundleTicketDetailById(bundleTicketId);
        return TcpResponse.from(response);
    }

    /**
     * 관리자 티켓상세 조회
     * @param request
     */
    @MessagePattern(GameMessagePatterns.TICKET_findAdminTicketDetailById)
    async findAdminTicketDetailById(request: TcpRequest<string>): Promise<TcpResponse<TicketDetailsDto>> {
        this.logger.log("findAdminTicketDetailById -> ", request.data);
        const response = await this.ticketService.findAdminTicketDetailById(request.data);
        return TcpResponse.from(response);
    }

    /**
     * 플레이어 티켓 구매 목록 조회
     * @param request
     */
    @MessagePattern(GameMessagePatterns.TICKET_findTicketDetailPaginationByOwnerId)
    findTicketDetailPaginationByOwnerId(
        request: TcpPaginationRequest<FilterSort>
    ): Promise<TcpPaginationResponse<PurchaseTicketListDto[]>> {
        return this.bundleTicketService.findPurchaseBundleTicketList(request.data, request.pagination);
    }

    /**
     * 발권티켓
     * @param request
     */
    @MessagePattern(GameMessagePatterns.TICKET_createIssuedTicket)
    async createIssuedTicket(request: TcpRequest<CreateIssuingTicketDto>): Promise<TcpResponse<TicketDetailsDto>> {
        this.logger.log("createIssuedTicket  request -> ", request);
        const ticketDetails = await this.ticketService.createIssuedTicket(request.data);
        return TcpResponse.from(ticketDetails);
    }

    /**
     * 멀티 티켓 발행
     * @param request
     */
    @MessagePattern(GameMessagePatterns.TICKET_createBundleIssuedTicket)
    async createBundleIssuedTicket(request: TcpRequest<CreateIssuingTicketDto[]>): Promise<TcpResponse<BundleTicketDetailsDto>> {
        const ticketDetails = await this.bundleTicketService.createBundleIssuedTicket(request.data);
        return TcpResponse.from(ticketDetails);
    }

    /**
     * 미추첨 티켓 조회
     * @param request
     */
    @MessagePattern(GameMessagePatterns.TICKET_findOngoingTicketByOwnerId)
    findOngoingTicket(request: TcpPaginationRequest<FilterSort>): Promise<TcpPaginationResponse<Ticket[]>> {
        return this.ticketService.findOngoingTicket(request.data, request.pagination);
    }

    /**
     * 관리자 전체 티켓 목록 조회
     * @param request
     */
    @MessagePattern(GameMessagePatterns.TICKET_findAdminTotalTicketList)
    findAdminTotalTicketList(request: TcpPaginationRequest<SearchFilterSort>): Promise<TcpPaginationResponse<TotalTicketListDto[]>> {
        return this.ticketService.findAdminTotalTicketList(request);
    }

    /**
     * 관리자 티켓 거래내역 조회
     */
    @MessagePattern(GameMessagePatterns.TICKET_findTicketTransactionList)
    findTicketTransactionList(request: TcpPaginationRequest<SearchFilterSort>): Promise<TcpPaginationResponse<TicketTransactionDto[]>> {
        return this.ticketService.findTicketTransactionList(request);
    }

    /**
     * 관리자 티켓 거래내역 상세조회
     */
    @MessagePattern(GameMessagePatterns.TICKET_findTicketTransactionDetails)
    findTicketTransactionDetails(request: TcpRequest<string>): Promise<TcpResponse<any>> {
        return this.ticketService.findTicketTransactionDetails(request);
    }

}
