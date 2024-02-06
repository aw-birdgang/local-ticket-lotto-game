import {Injectable, Logger} from '@nestjs/common';
import {BatchJob} from "../entity/batch-job.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {RoundService} from "./round.service";
import {WinningNumberService} from "./winning-number.service";
import {isEmpty, isNotEmpty} from "class-validator";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {RoundStatus} from "../entity/game.enum";
import {ErrorCodes} from "../../common/exception/error.enum";

@Injectable()
export class BatchJobService {
    constructor(
        @InjectRepository(BatchJob) private readonly batchJobRepository: Repository<BatchJob>,
        private readonly roundService: RoundService,
        private readonly winningNumberService: WinningNumberService,
    ) {}

    private readonly logger = new Logger(BatchJobService.name);

    /**
     * 어드민페이지에서 강제 배치잡 등록( batch cron job 에서 반복 10초로 실행 )
     */
    async forcedBatchJob(sessionUserId: number) {
        const activeRound = await this.roundService.findByActive(1);
        this.logger.log("forcedBatchJob  activeRound -> ", activeRound);
        if (isEmpty(activeRound)) {
            this.logger.log("empty active game round information.");
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_002);
        }
        if (activeRound.status != RoundStatus.ACTIVE) {
            this.logger.log("inactive game round.");
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_002);
        }
        const checkBatchJob = await this.batchJobRepository.findOneBy({ roundId: activeRound.id });
        if (isNotEmpty(checkBatchJob)) {
            this.logger.log("현재 활성화된 게임라운드가 배치잡에 등록된 상태입니다.");
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_016);
        }
        const winningNumber = await this.winningNumberService.findByRoundId(activeRound.id);
        if (isEmpty(winningNumber)) {
            this.logger.log("현재 활성화된 게임라운드에 당첨번호 정보가 없습니다.");
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_011);
        }

        const batchJob = new BatchJob();
        batchJob.workerId = sessionUserId;
        batchJob.registrationDate = new Date();
        batchJob.roundId = activeRound.id;
        batchJob.ruleId = 0;

        return this.batchJobRepository.save(batchJob);
    }
}
