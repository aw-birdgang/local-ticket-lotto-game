import {Body, Controller, HttpCode, HttpStatus, Post, Req} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiHeader,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";
import {TicketPrizePayoutDto} from "../dto/ticket-prize-payout.dto";
import {PrizePayoutMsaService} from "../service/msa/prize-payout.msa.service";
import {PrizeClaimParameter} from "../entity/finance.parameter";
import {PrizePayoutDetailDto} from "../dto/prize-payout-detail.dto";
import {FromHttpHeader} from "../../common/microservice/from-http-header";

@ApiBearerAuth("BearerAuth")
@ApiTags("Lotto/Finance")
@Controller("private/finance/prizes")
export class PrizePayoutController {
    constructor(private prizePayoutMsService: PrizePayoutMsaService) {}

    @ApiOperation({ summary: "당첨 지급 요청" })
    @ApiOkResponse({
        type: TicketPrizePayoutDto,
        description: "200. Success. Returns a lotto winning ticket",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. WinningTicket was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({ name: "x_session_user_id", required: false, description: "userId" })
    @ApiBody({ type: PrizeClaimParameter })
    @Post("request-prize-claim")
    async requestPrizeClaim(@Req() request: Request, @Body() body: PrizeClaimParameter): Promise<PrizePayoutDetailDto> {
        const sessionUserId = FromHttpHeader.from(request).getSessionUserId();
        console.log("requestPrizeClaim  -> ", body, sessionUserId);
        return this.prizePayoutMsService.requestPrizeClaimable(sessionUserId, body.ticketId);
    }
}
