import {Controller, Logger} from '@nestjs/common';
import {MessagePattern} from "@nestjs/microservices";
import {BatchJobService} from "../service/batch-job.service";
import {RoundService} from "../service/round.service";
import {isEmpty} from "class-validator";
import {RoundDto} from "../dto/round.dto";
import {RoundCycleParameter} from "../entity/game.parameter";
import {ErrorCodes} from "../../common/exception/error.enum";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {GameMessagePatterns} from "../../common/microservice/game-message-pattern";
import {TcpRequest} from "../../common/microservice/tcp-request";
import {TcpResponse} from "../../common/microservice/tcp-response";
import {BatchJobDto} from "../dto/batch-job.dto";

@Controller()
export class BatchController {
    constructor(
        private readonly batchJobService: BatchJobService,
        private readonly roundService: RoundService
    ) {
    }

    private readonly logger = new Logger(BatchController.name);

    /**
     * round divide by cycle code
     * @param request gameId
     */
    @MessagePattern(GameMessagePatterns.GAME_resetRoundByCycleCode)
    async resetRoundByCycleCode(request: TcpRequest<RoundCycleParameter>): Promise<TcpResponse<RoundDto>> {
        this.logger.log("resetRoundByCycleCode -> ", request);
        const sessionUserId = request.headers["sessionUserId"];
        if (isEmpty(sessionUserId)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_012);
        }
        const round = await this.roundService.resetRoundByCycleCode(request.data.cycleCode);
        return TcpResponse.from<RoundDto>(round);
    }

    /**
     * game forced close
     * @param request gameId
     */
    @MessagePattern(GameMessagePatterns.GAME_forcedBatchJob)
    async forcedBatchJob(request: TcpRequest<any>): Promise<TcpResponse<BatchJobDto>> {
        this.logger.log("forcedBatchJob -> ", request);
        const sessionUserId = request.headers["sessionUserId"];
        if (isEmpty(sessionUserId)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_012);
        }
        const batchJob = await this.batchJobService.forcedBatchJob(sessionUserId);
        return TcpResponse.from<BatchJobDto>(isEmpty(batchJob) ? null : batchJob.toBatchJobDto());
    }
}
