import { Injectable } from '@nestjs/common';
import {GameKafkaClientService} from "../../../common/microservice/kafka-game-client-service";
import {Pagination, TcpPaginationRequest, TcpRequest} from "../../../common/microservice/tcp-request";
import {GameMessagePatterns} from "../../../common/microservice/game-message-pattern";
import {TcpPaginationResponse, TcpResponse} from "../../../common/microservice/tcp-response";
import {AssetTransactionDto} from "../../dto/asset-transaction.dto";
import {FilterSort} from "../../../common/microservice/from-search-filter";
import {AssetTransactionDetailDto} from "../../dto/asset-transaction-detail.dto";
import {DepositDto} from "../../dto/deposit.dto";
import {BuyTicketDto} from "../../dto/buy-ticket.dto";

@Injectable()
export class AssetTransactionMsaService {
    constructor(private readonly gameKafkaClientService: GameKafkaClientService) {}

    async findAssetTransactionById(assetTransactionId: number) {
        const request = TcpRequest.from<number>(assetTransactionId);
        const response = await this.gameKafkaClientService.send<TcpResponse<AssetTransactionDto>>(
            GameMessagePatterns.FINANCE_findAssetTransactionById,
            request,
        );
        return response.data;
    }

    async findAssetTransactionPaginationByFilterSort(sessionUserId: number, filterSort: FilterSort, pagination: Pagination) {
        const request = TcpPaginationRequest.from<FilterSort>(filterSort, pagination, { sessionUserId });
        return this.gameKafkaClientService.send<TcpPaginationResponse<AssetTransactionDetailDto[]>>(
            GameMessagePatterns.FINANCE_findAssetTransactionPaginationByFilterSort,
            request,
        );
    }

    async pointDeposit(depositDto: DepositDto) {
        const request = TcpRequest.from<DepositDto>(depositDto);
        const response = await this.gameKafkaClientService.send<TcpResponse<AssetTransactionDto>>(
            GameMessagePatterns.FINANCE_pointDeposit,
            request
        );
        return response.data;
    }

    async buyTicket(buyTicketDto: BuyTicketDto) {
        const request = TcpRequest.from<BuyTicketDto>(buyTicketDto);
        const response = await this.gameKafkaClientService.send<TcpResponse<AssetTransactionDto>>(
            GameMessagePatterns.FINANCE_buyTicket,
            request
        );
        return response.data;
    }
}
