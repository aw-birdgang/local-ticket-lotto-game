import {Controller, Get, HttpCode, HttpStatus, Param, Query} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags
} from "@nestjs/swagger";
import {RoundMsaService} from "../service/round.msa.service";
import {RoundSummaryDto} from "../dto/round-summary.dto";
import {Public} from "../../auth/guard/auth.decorator";

@ApiBearerAuth("BearerAuth")
@ApiTags("Lotto/Round")
@Controller("private/game")
export class RoundController {
    constructor(private roundMsService: RoundMsaService) {}

    @ApiOperation({ summary: "활성된 게임 라운드 내역 조회" })
    @ApiOkResponse({
        type: RoundSummaryDto,
        description: "200. Success. Returns a lotto active rounds",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. Game Rounds was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiParam({ name: "gameId", type: Number, description: "game id" })
    @Public()
    @Get("games/:gameId/rounds/active/summary")
    findRoundSummaryByActive(@Param("gameId") gameId: number): Promise<RoundSummaryDto> {
        console.log("findRoundSummaryByActive  start...");
        return this.roundMsService.findRoundSummaryByActive(gameId);
    }

    @ApiOperation({ summary: "게임 라운드 내역 조회" })
    @ApiOkResponse({
        type: RoundSummaryDto,
        description: "200. Success. Returns a lotto rounds info",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. Game Rounds was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiParam({ name: "gameId", type: Number, description: "gameId" })
    @ApiParam({ name: "turnNumber", type: Number, description: "turnNumber" })
    @Public()
    @Get("games/:gameId/rounds/:turnNumber/summary")
    findRoundSummaryByGameIdAndTurnNumber(@Param("gameId") gameId: number, @Param("turnNumber") turnNumber: number) {
        console.log("findRoundSummaryByGameIdAndTurnNumber  start...");
        return this.roundMsService.findRoundSummaryByGameIdAndTurnNumber(gameId, turnNumber);
    }

    @ApiOperation({ summary: "게임 라운드 목록 조회" })
    @ApiOkResponse({
        type: [RoundSummaryDto],
        description: "200. Success. Returns a lotto rounds list",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. Game Rounds was not found",
    })
    @HttpCode(HttpStatus.OK)
    @ApiParam({ name: "gameId", type: Number, description: "gameId" })
    @ApiQuery({ name: "page", type: Number, required: true, description: "page" })
    @ApiQuery({ name: "offset", type: Number, required: true, description: "offset" })
    @Public()
    @Get("games/:gameId/rounds")
    findRoundSummaryPagination(@Param("gameId") gameId: number, @Query() query: any) {
        console.log("roundsByQuery  gameId -> ", gameId);
        console.log("roundsByQuery  query -> ", query);
        const { page, offset } = query;
        return this.roundMsService.findRoundSummaryPagination(gameId, Number(page), Number(offset));
    }
}
