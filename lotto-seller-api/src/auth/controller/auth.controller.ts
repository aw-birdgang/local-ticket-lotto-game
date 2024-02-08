import {Body, Controller, Post} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {AuthService} from "../service/auth.service";
import {JWTokenDto} from "../dto";
import {LogInDto} from "../dto/log-in.dto";
import {Public} from "../guard/auth.decorator";
import {RequestRefreshTokenDto} from "../dto/request-refresh-token.dto";

@ApiBearerAuth("BearerAuth")
@ApiTags("Authorization")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: "로그인" })
    @ApiUnauthorizedResponse({ description: "401. UnauthorizedException." })
    @ApiForbiddenResponse({ description: "403. ForbiddenException." })
    @ApiOkResponse({
        type: JWTokenDto,
        description: "200. Success. Returns a JWT Tokens",
    })
    @ApiBody({ type: LogInDto })
    @Public()
    @Post("login")
    async login(@Body() logInDto: LogInDto) {
        console.log("seller login :", logInDto);
        const result = await this.authService.login(logInDto);
        return result.data;
    }

    @ApiOperation({ summary: "리프레쉬 토큰 요청" })
    @ApiUnauthorizedResponse({ description: "401. UnauthorizedException." })
    @ApiForbiddenResponse({ description: "403. ForbiddenException." })
    @ApiOkResponse({
        type: JWTokenDto,
        description: "200. Success. Returns a JWT Tokens",
    })
    @ApiBody({ type: RequestRefreshTokenDto })
    @Public()
    @Post("refresh")
    async refresh(@Body() requestRefreshTokenDto: RequestRefreshTokenDto) {
        const result = await this.authService.refresh(requestRefreshTokenDto);
        return result.data;
    }
}
