import {HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {AccountMsaService} from "../../account/service/account.msa.service";
import {LogInDto} from "../dto/log-in.dto";
import {isEmpty} from "class-validator";
import {ClientHttpException} from "../../common/exception/client-http-exception";
import {ClientRegisterMsaService} from "../../account/service/client-register.msa.service";
import {convertErrorMessage, ErrorCodes} from "../../common/exception/error.enum";
import {JWTokenDto} from "../dto/jwt-tokens.dto";
import {EditTokenParameter} from "../../account/entity/account.parameter";
import {ClientAccessType, SocialType} from "../../account/entity/account.enum";
import {Payload} from "../dto/jwt-payload.dto";
import bcryptjs from "bcryptjs";
import {PlayerUserSocialDto} from "../../account/dto/player-user-social.dto";
import {format} from "date-fns";

@Injectable()
export class AuthService {
    private readonly jwtSecretKey = process.env.JWT_SECRET_KEY;

    constructor(
        private readonly jwtService: JwtService,
        private readonly playerUserMsService: AccountMsaService,
        private readonly clientRegisterMsService: ClientRegisterMsaService,
    ) {}

    async login(loginDto: LogInDto) {
        console.log("login start...");
        const userDto = await this.playerUserMsService.findPlayerUserByUsername(loginDto.username);
        if (isEmpty(userDto)) {
            throw new ClientHttpException(HttpStatus.UNAUTHORIZED, convertErrorMessage(ErrorCodes.AUT_ERROR_001), null);
        }
        console.log("login user : ", JSON.stringify(userDto));
        const passwordHash = await this.playerUserMsService.findPlayerUserPasswordHashById(userDto.id);
        console.log("login passwordHash : ", passwordHash);
        if (passwordHash !== loginDto.password) {
            throw new ClientHttpException(HttpStatus.UNAUTHORIZED, convertErrorMessage(ErrorCodes.AUT_ERROR_002), null);
        }
        // Password comparison
        // const same = await this.comparePasswords(loginDto.password, passwordHash);
        // if (!same) {
        //   throw new UnauthorizedException();
        // }

        const payload = { username: userDto.username, sub: userDto.id };
        // console.log("login payload : ", payload);
        const jWTokenDto = new JWTokenDto();
        jWTokenDto.accessToken = await this.generateAccessToken(payload);
        jWTokenDto.refreshToken = await this.generateRefreshToken(payload);

        await this.clientRegisterMsService.editClientRegisterToken(EditTokenParameter.from(userDto.id, ClientAccessType.PLAYER_USER, jWTokenDto.refreshToken));

        return jWTokenDto;
    }

    tokenVerify(token: string): Promise<Payload> {
        return this.jwtService.verifyAsync(token, {
            secret: this.jwtSecretKey,
        });
    }

    private generateAccessToken(payload: object): Promise<string> {
        console.log("generateAccessToken  -> ", this.jwtSecretKey);
        const options = {
            secret: this.jwtSecretKey,
            expiresIn: "7d",
        };
        return this.jwtService.signAsync(payload, options);
    }

    private generateRefreshToken(payload: object): Promise<string> {
        const options = {
            secret: this.jwtSecretKey,
            expiresIn: "30d",
        };
        return this.jwtService.signAsync(payload, options);
    }

    private hashPassword(password: string): Promise<string> {
        return bcryptjs.hash(password, 12);
    }

    private comparePasswords(password: string, passwordHash: string): Promise<boolean> {
        return bcryptjs.compare(password, passwordHash);
    }

    async googleLoginCallBack(req: any) {
        if (!req.user) {
            console.error('No user from google');
        }
        const name = req.user.lastName+req.user.firstName;
        const email = req.user.email;

        const playerUserSocialDto = new PlayerUserSocialDto();
        playerUserSocialDto.email = email;
        playerUserSocialDto.username = name;
        playerUserSocialDto.accessToken = req.user.accessToken;
        playerUserSocialDto.socialType = SocialType.GOOGLE;

        await this.playerUserMsService.playerUserGoogleLogin(playerUserSocialDto);

        const payload = { username: name, sub: email, roles: [] };
        const jwTokenDto = new JWTokenDto();
        jwTokenDto.accessToken = await this.generateAccessToken(payload);
        jwTokenDto.refreshToken = await this.generateRefreshToken(payload);
        await this.clientRegisterMsService.editClientRegisterToken(EditTokenParameter.from(email, ClientAccessType.PLAYER_USER, jwTokenDto.refreshToken));

        const result = {
            email: email,
            jwt: jwTokenDto.accessToken,
            refresh: jwTokenDto.refreshToken,
            expiresIn: format(new Date(), "yyyy-MM-dd'T'HH:mm:00.000")
        };

        return result;
    }
}
