import { Injectable } from '@nestjs/common';
import {AccountKafkaClientService} from "../../common/microservice/kafka-account-client-service";
import {ClientRegisterDto} from "../dto/client-register.dto";
import {CreateClientRegisterDto} from "../dto/create-client-register.dto";
import {TcpRequest} from "../../common/microservice/tcp-request";
import {AccountMessagePatterns} from "../../common/microservice/account-message-pattern";
import {EditTokenParameter} from "../entity/account.parameter";

@Injectable()
export class ClientRegisterMsService {
    constructor(private readonly accountKafkaClientService: AccountKafkaClientService) {}

    create(parameter: CreateClientRegisterDto): Promise<ClientRegisterDto> {
        const request = TcpRequest.from<CreateClientRegisterDto>(parameter);
        return this.accountKafkaClientService.send(AccountMessagePatterns.ACCOUNT_createClientRegister, request);
    }

    editToken(parameter: EditTokenParameter): Promise<boolean> {
        const request = TcpRequest.from<EditTokenParameter>(parameter);
        return this.accountKafkaClientService.send(AccountMessagePatterns.ACCOUNT_editClientRegisterToken, request);
    }
}
