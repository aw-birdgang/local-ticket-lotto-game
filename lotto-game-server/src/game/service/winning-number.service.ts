import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {WinningNumber} from "../entity/winning-number.entity";
import {Repository} from "typeorm";
import {RoundService} from "./round.service";
import {CreateWinningNumberDto} from "../dto/create-winning-number.dto";
import {isEmpty} from "class-validator";
import {ClientRpcException} from "../../common/exception/client-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";

@Injectable()
export class WinningNumberService {
    constructor(
        @InjectRepository(WinningNumber) private readonly winningNumberRepository: Repository<WinningNumber>,
        private readonly roundService: RoundService,
    ) {}

    findByRoundId(roundId: number): Promise<WinningNumber> {
        return this.winningNumberRepository.findOneBy({ roundId });
    }

    /**
     * 라운드별 당첨번호,보너스번호 등록
     */
    async createWinningNumber(createWinningNumber: CreateWinningNumberDto): Promise<WinningNumber> {
        const round = await this.roundService.findByGameIdAndTurnNumber(createWinningNumber.gameId, createWinningNumber.turnNumber);
        if (isEmpty(round)) {
            throw new ClientRpcException(ErrorCodes.BUS_ERROR_002);
        }
        const winningNumber = WinningNumber.from(
            round.id,
            createWinningNumber.ball1,
            createWinningNumber.ball2,
            createWinningNumber.ball3,
            createWinningNumber.ball4,
            createWinningNumber.ball5,
            createWinningNumber.ball6,
            createWinningNumber.ballBonus,
        );
        return this.winningNumberRepository.save(winningNumber);
    }
}
