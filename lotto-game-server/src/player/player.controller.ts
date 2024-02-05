import {Controller} from '@nestjs/common';
import {PlayerService} from "./player.service";
import {MessagePattern, Transport} from "@nestjs/microservices";
import {AccountTcpCommands} from "../common/microservice/MicroserviceTcpClient";
import {TcpPaginationResponse} from "../common/microservice/TcpResponse";
import {FilterSort} from "../common/microservice/FromSearchFilter";
import {Player} from "./player.entity";
import {TcpPaginationRequest} from "../common/microservice/TcpRequest";

@Controller('player')
export class PlayerController {

    constructor(private playerService: PlayerService) {}

    @MessagePattern({ cmd: AccountTcpCommands.ACCOUNT_PLAYER_USER_TOTAL_LIST }, Transport.TCP)
    async findPlayerUserTotalList(request: TcpPaginationRequest<FilterSort>): Promise<TcpPaginationResponse<Player[]>> {
        const result = await this.playerService.findPlayerTotalList(request);
        return result;
    }

}
