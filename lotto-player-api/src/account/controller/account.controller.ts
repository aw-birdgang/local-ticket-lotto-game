import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody, ApiForbiddenResponse,
    ApiHeader,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation, ApiParam, ApiQuery,
    ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {AccountMsaService} from "../service/account.msa.service";
import {FromHttpHeader} from "../../common/microservice/from-http-header";
import {TicketMsaService} from "../../ticket/service/ticket.msa.service";
import {isEmpty} from "class-validator";
import {AssetMsaService} from "../../finance/service/msa/asset.msa.service";
import {AssetDto} from "../../finance/dto/asset.dto";
import {AssetType} from "../../finance/entity/finance.enum";
import {AssetTransactionMsaService} from "../../finance/service/msa/asset-transaction.msa.service";
import {TicketWinningMsaService} from "../../ticket/service/ticket-winning.msa.service";
import {DepositDto} from "../../finance/dto/deposit.dto";
import {FilterSort, SortingType} from "../../common/microservice/from-search-filter";
import {Pagination} from "../../common/microservice/tcp-request";
import {TicketDetailsDto} from "../../ticket/dto/ticket-deteils.dto";
import {TcpPaginationResponse} from "../../common/microservice/tcp-response";
import {PurchaseTicketListDto} from "../../ticket/dto/purchase-ticket-list.dto";
import {WinningTicketDetailDto} from "../../ticket/dto/winning-ticket-detail.dto";

@ApiBearerAuth("BearerAuth")
@ApiTags("Account/Account")
@Controller("private/account")
export class AccountController {
    constructor(
        private readonly accountMsService: AccountMsaService,
        private readonly ticketMsService: TicketMsaService,
        private readonly assetMsService: AssetMsaService,
        private readonly assetTransactionMsService: AssetTransactionMsaService,
        private readonly winningTicketMsService: TicketWinningMsaService,
    ) {
    }

    @ApiOperation({summary: "자산 잔액"})
    @ApiOkResponse({
        type: [AssetDto],
        description: "200. Success. Returns a asset balance",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. Asset was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({name: "x_session_user_id", required: false, description: "userId"})
    @Get("finance/asset-balance")
    assetBalance(@Req() request: Request) {
        return this.assetMsService.findAssetByOwnerIdAndAssetType(FromHttpHeader.from(request).getSessionUserId(), AssetType.USD);
    }

    @ApiOperation({summary: "포인트 충전"})
    @ApiOkResponse({
        type: [AssetDto],
        description: "200. Success. Returns a point deposit",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. point was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({name: "x_session_user_id", required: false, description: "userId"})
    @ApiBody({type: DepositDto})
    @Post("finance/point-deposit")
    pointDeposit(@Req() request: Request, @Body() depositDto: DepositDto) {
        if (isEmpty(depositDto.buyerId) || depositDto.buyerId == 0) {
            depositDto.buyerId = FromHttpHeader.from(request).getSessionUserId();
        }
        return this.assetTransactionMsService.pointDeposit(depositDto);
    }

    @ApiOperation({summary: "포인트 출금 *"})
    @ApiOkResponse({
        type: [AssetDto],
        description: "200. Success. Returns a point withdraw",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. point was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({name: "x_session_user_id", required: false, description: "userId"})
    @Get("finance/point-withdraw")
    pointWithdraw(@Req() request: Request) {
        return null;
    }

    @ApiOperation({summary: "입.출금 내역"})
    @ApiOkResponse({
        type: [DepositDto],
        description: "200. Success. Returns a deposit history",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. Deposit was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({name: "x_session_user_id", required: false, description: "userId"})
    @ApiQuery({
        name: "transactionType",
        type: String,
        required: false,
        description: "type (all, deposit_point, withdraw_point, buy_ticket, prize_ticket )",
    })
    @ApiQuery({name: "endDate", type: Date, required: false, description: "endDate ex(2020-01-01)"})
    @ApiQuery({name: "startDate", type: Date, required: false, description: "startDate ex(2020-01-01)"})
    @ApiQuery({name: "sort", type: String, required: false, description: "sort ex(transactionDate:ASC or transactionDate:DESC)"})
    @ApiQuery({name: "offset", type: Number, required: true, description: "offset"})
    @ApiQuery({name: "page", type: Number, required: true, description: "page"})
    @Get("finance/deposit-withdrawal-history")
    depositWithdrawalHistory(@Req() request: Request, @Query() query: any) {
        const sessionUserId = FromHttpHeader.from(request).getSessionUserId();
        const {transactionType, startDate, endDate, sort, page, offset} = query;
        const filters = {
            ownerId: sessionUserId,
            transactionType: transactionType,
            startDate: startDate,
            endDate: endDate,
        };
        const sorts: Record<string, any> = {};
        if (isEmpty(sort)) {
            sorts["transactionDate"] = SortingType.DESC;
        } else {
            const sortArray = sort.split(":");
            if (isEmpty(sortArray) || sortArray.length != 2) {
                sorts["transactionDate"] = SortingType.DESC;
            } else {
                sorts[`${sortArray[0]}`] = sortArray[1];
            }
        }
        const filterSort = FilterSort.from(filters, sorts);
        const pagination = Pagination.from(page, offset);
        console.log("depositWithdrawalHistory  -> ", filterSort, pagination);
        return this.assetTransactionMsService.findAssetTransactionPaginationByFilterSort(sessionUserId, filterSort, pagination);
    }

    //티켓 내역 임시
    @ApiOperation({summary: "티켓 상세"})
    @ApiOkResponse({
        type: TicketDetailsDto,
        description: "200. Success. Returns a ticket",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. Ticket was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({name: "x_session_user_id", required: false, description: "userId"})
    @ApiParam({name: "bundleTicketId", type: String, description: "bundleTicketId"})
    @Get("tickets/:bundleTicketId/details")
    findBundleTicketDetailById(@Param("bundleTicketId") bundleTicketId: string) {
        console.log("findTicketDetailById  ticketId -> ", bundleTicketId);
        return this.ticketMsService.findBundleTicketDetailById(bundleTicketId);
    }

    @ApiOperation({summary: "구매 내역"})
    @ApiOkResponse({
        type: TicketDetailsDto,
        description: "200. Success. Returns a purchase ticket details",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. purchase ticket details was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({name: "x_session_user_id", required: false, description: "userId"})
    @ApiQuery({
        name: "transactionType",
        type: String,
        required: true,
        description: "type (all, issued(ongoing), winning )",
    })
    @ApiQuery({name: "endDate", type: Date, required: false, description: "endDate ex(2020-01-01)"})
    @ApiQuery({name: "startDate", type: Date, required: false, description: "startDate ex(2020-01-01)"})
    @ApiQuery({name: "sort", type: String, required: false, description: "sort ex(transactionDate:ASC or transactionDate:DESC)"})
    @ApiQuery({name: "offset", type: Number, required: true, description: "offset"})
    @ApiQuery({name: "page", type: Number, required: true, description: "page"})
    @Get("tickets/purchase-history")
    findTicketDetailPaginationByOwnerId(@Req() request: Request, @Query() query: any): Promise<TcpPaginationResponse<PurchaseTicketListDto[]>> {
        const sessionUserId = FromHttpHeader.from(request).getSessionUserId();
        const {transactionType, startDate, endDate, sort, page, offset} = query;
        const filters = {
            ownerId: sessionUserId,
            transactionType: transactionType,
            startDate: startDate,
            endDate: endDate,
        };
        const sorts: Record<string, any> = {};
        if (isEmpty(sort)) {
            sorts["transactionDate"] = SortingType.DESC;
        } else {
            const sortArray = sort.split(":");
            if (isEmpty(sortArray) || sortArray.length != 2) {
                sorts["transactionDate"] = SortingType.DESC;
            } else {
                sorts[`${sortArray[0]}`] = sortArray[1];
            }
        }
        const pagination = Pagination.from(page, offset);
        return this.ticketMsService.findTicketDetailPaginationByOwnerId(sessionUserId, FilterSort.from(filters, sorts), pagination);
    }

    @ApiOperation({summary: "미추첨 티켓"})
    @ApiOkResponse({
        type: TicketDetailsDto,
        description: "200. Success. Returns a ticket",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. Ticket was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({name: "x_session_user_id", required: false, description: "userId"})
    @ApiQuery({
        name: "transactionType",
        type: String,
        required: true,
        description: "type (all, issued(ongoing), winning )",
    })
    @ApiQuery({name: "endDate", type: Date, required: false, description: "endDate ex(2020-01-01)"})
    @ApiQuery({name: "startDate", type: Date, required: false, description: "startDate ex(2020-01-01)"})
    @ApiQuery({name: "sort", type: String, required: false, description: "sort ex(transactionDate:ASC or transactionDate:DESC)"})
    @ApiQuery({name: "offset", type: Number, required: true, description: "offset"})
    @ApiQuery({name: "page", type: Number, required: true, description: "page"})
    @Get("tickets/ongoing-ticket-list")
    findOngoingTicket(@Req() request: Request, @Query() query: any): Promise<TcpPaginationResponse<TicketDetailsDto[]>> {
        const sessionUserId = FromHttpHeader.from(request).getSessionUserId();
        const {transactionType, startDate, endDate, sort, page, offset} = query;
        const filters = {
            ownerId: sessionUserId,
            transactionType: transactionType,
            startDate: startDate,
            endDate: endDate,
        };
        const sorts: Record<string, any> = {};
        if (isEmpty(sort)) {
            sorts["transactionDate"] = SortingType.DESC;
        } else {
            const sortArray = sort.split(":");
            if (isEmpty(sortArray) || sortArray.length != 2) {
                sorts["transactionDate"] = SortingType.DESC;
            } else {
                sorts[`${sortArray[0]}`] = sortArray[1];
            }
        }
        const pagination = Pagination.from(page, offset);
        return this.ticketMsService.findOngoingTicketByOwnerId(sessionUserId, FilterSort.from(filters, sorts), pagination);
    }

    @ApiOperation({summary: "당첨 티켓 내역"})
    @ApiOkResponse({
        type: [TicketDetailsDto],
        description: "200. Success. Returns a ticket detail information",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. WinningPlayer was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({name: "x_session_user_id", required: false, description: "userId"})
    @ApiQuery({name: "prizeStatus", type: String, required: false, description: "Prize status ex(all, claimable, waiting, complete)"})
    @ApiQuery({name: "endDate", type: Date, required: false, description: "endDate ex(2020-01-01)"})
    @ApiQuery({name: "startDate", type: Date, required: false, description: "startDate ex(2020-01-01)"})
    @ApiQuery({name: "sort", type: String, required: false, description: "sort ex(claimDate:ASC or claimDate:DESC)"})
    @ApiQuery({name: "page", type: Number, required: true, description: "page"})
    @ApiQuery({name: "offset", type: Number, required: true, description: "offset"})
    @Get("tickets/winning-ticket-history")
    winningTicketHistory(@Req() request: Request, @Query() query: any): Promise<TcpPaginationResponse<WinningTicketDetailDto[]>> {
        const sessionUserId = FromHttpHeader.from(request).getSessionUserId();
        const {prizeStatus, startDate, endDate, sort, page, offset} = query;
        const filters = {
            ownerId: sessionUserId,
            prizeStatus: prizeStatus,
            startDate: startDate,
            endDate: endDate,
        };
        const sorts: Record<string, any> = {};
        if (isEmpty(sort)) {
            sorts["claimDate"] = SortingType.DESC;
        } else {
            const sortArray = sort.split(":");
            if (isEmpty(sortArray) || sortArray.length != 2) {
                sorts["claimDate"] = SortingType.DESC;
            } else {
                sorts[`${sortArray[0]}`] = sortArray[1];
            }
        }
        const filterSort = FilterSort.from(filters, sorts);
        const pagination = Pagination.from(page, offset);
        console.log("winningTicketHistory  -> ", filterSort, pagination);
        return this.winningTicketMsService.findWinningTicketDetailByFilterSort(sessionUserId, filterSort, pagination);
    }

    @ApiOperation({summary: "사용자 정보 수정*"})
    @ApiUnauthorizedResponse({description: "401. UnauthorizedException."})
    @ApiForbiddenResponse({description: "403. ForbiddenException."})
    @ApiOkResponse({
        type: String,
        description: "200. Success. Returns a edit user information",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({name: "x_session_user_id", required: false, description: "userId"})
    @Get("edit-user-info")
    editUserInfo(@Req() request: Request): Promise<string> {
        return null;
    }

    @ApiOperation({summary: "비밀 번호 찾기*"})
    @ApiUnauthorizedResponse({description: "401. UnauthorizedException."})
    @ApiForbiddenResponse({description: "403. ForbiddenException."})
    @ApiOkResponse({
        type: String,
        description: "200. Success. Returns a find password",
    })
    @HttpCode(HttpStatus.OK)
    @ApiHeader({name: "x_session_user_id", required: false, description: "userId"})
    @Get("find-password")
    findPassword(@Req() request: Request): Promise<string> {
        return null;
    }
}
