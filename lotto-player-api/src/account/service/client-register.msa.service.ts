import {Injectable} from '@nestjs/common';
import {AccountKafkaClientService} from "../../common/microservice/kafka-account-client-service";
import {CreateClientRegisterDto} from "../dto/create-client-register.dto";
import {TcpRequest} from "../../common/microservice/tcp-request";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {ClientRegisterDto} from "../dto/client-register.dto";
import {AccountMessagePatterns} from "../../common/microservice/account-message-pattern";
import {EditTokenParameter} from "../entity/account.parameter";

@Injectable()
export class ClientRegisterMsaService {
    constructor(private readonly accountKafkaClientService: AccountKafkaClientService) {
    }

    async createClientRegister(createClientRegisterDto: CreateClientRegisterDto) {
        const request = TcpRequest.from<CreateClientRegisterDto>(createClientRegisterDto);
        const response = await this.accountKafkaClientService.send<TcpResponse<ClientRegisterDto>>(
            AccountMessagePatterns.ACCOUNT_createClientRegister,
            request
        );
        return response.data;
    }

    async editClientRegisterToken(editTokenParameter: EditTokenParameter) {
        const request = TcpRequest.from<EditTokenParameter>(editTokenParameter);
        const response = await this.accountKafkaClientService.send<TcpResponse<boolean>>(
            AccountMessagePatterns.ACCOUNT_editClientRegisterToken,
            request
        );
        return response.data;
    }
}
