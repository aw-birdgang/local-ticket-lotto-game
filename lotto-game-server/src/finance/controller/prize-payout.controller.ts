import {Controller, Logger} from '@nestjs/common';
import {PrizePayoutService} from "../service/prize-payout.service";
import {MessagePattern} from "@nestjs/microservices";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {TcpPaginationRequest, TcpRequest} from "../../common/microservice/tcp-request";
import {isEmpty} from "class-validator";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {PrizePayoutDetailDto} from "../dto/prize-payout-detail.dto";
import {FilterSort} from "../../common/microservice/from-search-filter";
import {WinningTicketDetailDto} from "../../ticket/dto/winning-ticket-detail.dto";
import {SaveConfirmPayoutDto} from "../dto/save-confirm-payout.dto";

@Controller()
export class PrizePayoutController {
    constructor(private readonly prizePayoutService: PrizePayoutService) {
    }

    private readonly logger = new Logger(PrizePayoutController.name);

    @MessagePattern(GameMessagePatterns.FINANCE_findPrizePayoutDetailById)
    async findPrizePayoutDetailById(request: TcpPaginationRequest<number>) {
        this.logger.log("findPrizePayoutDetailById  -> ", request);
        const sessionUserId = request.headers["sessionUserId"];
        if (isEmpty(sessionUserId)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_005);
        }
        const prizeId = request.data;
        const prizePayoutDetailDto = await this.prizePayoutService.findPrizePayoutDetailById(prizeId);
        return TcpResponse.from<PrizePayoutDetailDto>(prizePayoutDetailDto);
    }

    @MessagePattern(GameMessagePatterns.FINANCE_findPrizePayoutDetailByFilterSort)
    async findPrizePayoutDetailByFilterSort(request: TcpPaginationRequest<FilterSort>) {
        this.logger.log("findPrizePayoutDetailByFilterSort  -> ", request);
        const sessionUserId = request.headers["sessionUserId"];
        if (isEmpty(sessionUserId)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_005);
        }
        return await this.prizePayoutService.findByFilterSort(request.data, request.pagination);
    }

    @MessagePattern(GameMessagePatterns.FINANCE_requestPrizeClaimable)
    async requestPrizeClaimable(request: TcpRequest<string>) {
        this.logger.log("requestPrizeClaimable  -> ", request);
        const sessionUserId = request.headers["sessionUserId"];
        if (isEmpty(sessionUserId)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_005);
        }
        const ticketId = request.data;
        const winningTicketDetailDto = await this.prizePayoutService.requestPrizeClaimable(ticketId);
        return TcpResponse.from<WinningTicketDetailDto>(winningTicketDetailDto);
    }

    @MessagePattern(GameMessagePatterns.FINANCE_confirmPayout)
    async confirmPayout(request: TcpRequest<SaveConfirmPayoutDto>) {
        this.logger.log("confirmPayout  -> ", request);
        const sessionUserId = request.headers["sessionUserId"];
        if (isEmpty(sessionUserId)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_005);
        }
        const saveConfirmPayoutDto = request.data;
        const prizePayoutDetailList = await this.prizePayoutService.confirmPayout(saveConfirmPayoutDto);
        return TcpResponse.from<PrizePayoutDetailDto[]>(prizePayoutDetailList);
    }
}
