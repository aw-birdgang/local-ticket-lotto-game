import {Controller, Get, HttpCode, Headers, HttpStatus, Param} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiHeader,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags
} from "@nestjs/swagger";
import {GameMsaService} from "../service/game.msa.service";
import {GameDetailsDto} from "../dto/game-details.dto";
import {LanguageCode} from "../../common/model/common.enum";
import {GameWinningRuleLanguageDto} from "../dto/game-winning-rule-language.dto";
import {Public} from "../../auth/guard/auth.decorator";

@ApiBearerAuth("BearerAuth")
@ApiTags("Lotto/Game")
@Controller("private/game/games")
export class GameController {
    constructor(private readonly gameMsService: GameMsaService) {}

    @ApiOperation({ summary: "게임 상세 정보 조회" })
    @ApiOkResponse({
        type: GameDetailsDto,
        description: "200. Success. Returns a game detail info",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. User was not found",
    })
    @ApiHeader({ name: "language_code", enum: LanguageCode, required: false, description: "languageCode" })
    @ApiParam({ name: "gameId", type: Number, description: "gameId" })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Get(":gameId/details")
    gameById(@Headers() headers: Record<string, string>, @Param("gameId") gameId: number) {
        const languageCode = headers["language_code"];
        return this.gameMsService.findGameDetailsByGameId(gameId, languageCode);
    }

    @ApiOperation({ summary: "게임 당첨규칙 조회" })
    @ApiOkResponse({
        type: [GameWinningRuleLanguageDto],
        description: "200. Success. Returns a game winning rules",
    })
    @ApiNotFoundResponse({
        description: "404. NotFoundException. game winning rules was not found",
    })
    @ApiHeader({ name: "language_code", enum: LanguageCode, required: false, description: "languageCode" })
    @ApiParam({ name: "gameId", type: Number, description: "gameId" })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Get(":gameId/winning-rules")
    gameWinningRulesById(@Headers() headers: Record<string, string>, @Param("gameId") gameId: number): Promise<GameWinningRuleLanguageDto[]> {
        const languageCode = headers["language_code"];
        return this.gameMsService.findGameWinningRulesByGameId(gameId, languageCode);
    }
}
