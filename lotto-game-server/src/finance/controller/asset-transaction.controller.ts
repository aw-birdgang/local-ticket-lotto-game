import {Controller, Logger} from '@nestjs/common';
import {AssetTransactionService} from "../service/asset-transaction.service";
import {MessagePattern} from "@nestjs/microservices";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {TcpPaginationRequest, TcpRequest} from "../../common/microservice/tcp-request";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {AssetTransactionDto} from "../dto/asset-transaction.dto";
import {FilterSort} from "../../common/microservice/from-search-filter";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {isEmpty} from "class-validator";
import {ErrorCodes} from "../../common/exception/error.enum";
import {DepositDto} from "../dto/deposit.dto";
import {BuyTicketDto} from "../dto/buy-ticket.dto";

@Controller()
export class AssetTransactionController {
    constructor(private readonly assetTransactionService: AssetTransactionService) {
    }

    private readonly logger = new Logger(AssetTransactionController.name);

    @MessagePattern(GameMessagePatterns.FINANCE_findAssetTransactionById)
    async findAssetTransactionById(request: TcpRequest<number>) {
        this.logger.log("findAssetTransactionById  -> ", request);
        const assetTransaction = await this.assetTransactionService.findById(Number(request.data));
        return TcpResponse.from<AssetTransactionDto>(assetTransaction.toAssetTransactionDto());
    }

    @MessagePattern(GameMessagePatterns.FINANCE_findAssetTransactionPaginationByFilterSort)
    async findAssetTransactionPaginationByFilterSort(
        request: TcpPaginationRequest<FilterSort>
    ) {
        this.logger.log("findAssetTransactionPaginationByFilterSort  -> ", request);
        const sessionUserId = request.headers["sessionUserId"];
        if (isEmpty(sessionUserId)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_005);
        }
        return this.assetTransactionService.findPaginationByFilterSort(request.data, request.pagination);
    }

    @MessagePattern(GameMessagePatterns.FINANCE_pointDeposit)
    async pointDeposit(request: TcpRequest<DepositDto>) {
        this.logger.log("pointDeposit  -> ", request);
        const assetTransaction = await this.assetTransactionService.deposit(request.data);
        return TcpResponse.from<AssetTransactionDto>(assetTransaction.toAssetTransactionDto());
    }

    @MessagePattern(GameMessagePatterns.FINANCE_buyTicket)
    async buyTicket(request: TcpRequest<BuyTicketDto>) {
        this.logger.log("buyTicket  request -> ", request);
        const assetTransaction = await this.assetTransactionService.buyTicket(request.data);
        return TcpResponse.from<AssetTransactionDto>(assetTransaction.toAssetTransactionDto());
    }

    @MessagePattern(GameMessagePatterns.FINANCE_cancelTicket)
    async cancelTicket(request: TcpRequest<BuyTicketDto>) {
        this.logger.log("cancelTicket  request -> ", request);
        await this.assetTransactionService.cancelTicket(request.data);
        return TcpResponse.from<boolean>(true);
    }
}
