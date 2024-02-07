import { Injectable } from '@nestjs/common';
import {AccountKafkaClientService} from "../../common/microservice/kafka-account-client-service";
import {PlayerUserDto} from "../dto/player-user.dto";
import {SignUpDto} from "../../auth/dto/sign-up.dto";
import {TcpRequest} from "../../common/microservice/tcp-request";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {AccountMessagePatterns} from "../../common/microservice/account-message-pattern";
import {PlayerUserSocialDto} from "../dto/player-user-social.dto";

@Injectable()
export class AccountMsaService {
    constructor(private readonly accountKafkaClientService: AccountKafkaClientService) {
    }

    async signUpPlayerUser(signUpDto: SignUpDto): Promise<PlayerUserDto> {
        const request = TcpRequest.from<SignUpDto>(signUpDto);
        const response = await this.accountKafkaClientService.send<TcpResponse<PlayerUserDto>>(
            AccountMessagePatterns.ACCOUNT_signUpPlayerUser,
            request
        );
        return response.data;
    }

    findPlayerUserById(userId: number): Promise<PlayerUserDto> {
        const request = TcpRequest.from<number>(userId);
        return this.accountKafkaClientService.send<PlayerUserDto>(
            AccountMessagePatterns.ACCOUNT_findPlayerUserById,
            request
        );
    }

    async findPlayerUserByUsername(username: string): Promise<PlayerUserDto> {
        const request = TcpRequest.from<string>(username);
        const response = await this.accountKafkaClientService.send<TcpResponse<PlayerUserDto>>(
            AccountMessagePatterns.ACCOUNT_findPlayerUserByUsername,
            request
        );
        return response.data;
    }

    async findPlayerUserByEmail(email: string): Promise<PlayerUserDto> {
        const request = TcpRequest.from<string>(email);
        const response = await this.accountKafkaClientService.send<TcpResponse<PlayerUserDto>>(
            AccountMessagePatterns.ACCOUNT_findPlayerUserByEmail,
            request
        );
        return response.data;
    }

    async findPlayerUserPasswordHashById(userId: number): Promise<string> {
        const request = TcpRequest.from<number>(userId);
        const response = await this.accountKafkaClientService.send<TcpResponse<string>>(
            AccountMessagePatterns.ACCOUNT_findPlayerUserPasswordHashById,
            request
        );
        return response.data;
    }

    async playerUserGoogleLogin(playerUserSocialDto: PlayerUserSocialDto): Promise<string> {
        const request = TcpRequest.from<PlayerUserSocialDto>(playerUserSocialDto);
        const response = await  this.accountKafkaClientService.send<TcpResponse<string>>(
            AccountMessagePatterns.ACCOUNT_playerUserGoogleLogin,
            request
        );
        return response.data;
    }
}
