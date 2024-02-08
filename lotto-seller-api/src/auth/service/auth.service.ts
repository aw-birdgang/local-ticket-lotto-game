import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ClientRegisterMsService} from "../../account/service/client-register.ms.service";
import {AuthKafkaClientService} from "../../common/microservice/kafka-auth-client-service";
import {LogInDto} from "../dto/log-in.dto";
import {TcpRequest} from "../../common/microservice/tcp-request";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {SellerUserDto} from "../dto/seller-user.dto";
import {AuthMessagePatterns} from "../../common/microservice/auth-message-pattern";
import {RequestRefreshTokenDto} from "../dto/request-refresh-token.dto";
import {JWTokenDto, Payload} from "../dto";
import bcryptjs from "bcryptjs";

@Injectable()
export class AuthService {
    private readonly jwtSecretKey = process.env.JWT_SECRET_KEY;

    constructor(
        private readonly jwtService: JwtService,
        private readonly clientRegisterMsService: ClientRegisterMsService,
        private readonly authKafkaClientService: AuthKafkaClientService,
    ) {}

    // signUp(signUpDto: SignUpDto): Promise<UserDto> {
    //   const request = TcpRequest.from<SignUpDto>(signUpDto);
    //   return this.authKafkaClientService.send<UserDto>(AccountTcpCommands.ACCOUNT_USER_SIGNUP, request);
    // }

    async login(loginDto: LogInDto) {
        const request = TcpRequest.from<LogInDto>(loginDto);
        return await this.authKafkaClientService.send<TcpResponse<SellerUserDto>>(AuthMessagePatterns.AUTH_sellerUserLogin, request);
    }

    async refresh(requestRefreshToken: RequestRefreshTokenDto): Promise<TcpResponse<JWTokenDto>> {
        const request = TcpRequest.from<RequestRefreshTokenDto>(requestRefreshToken);
        return await this.authKafkaClientService.send<TcpResponse<RequestRefreshTokenDto>>(AuthMessagePatterns.AUTH_sellerUserRefreshToken, request);
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
}
