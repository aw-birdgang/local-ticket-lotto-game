import { Injectable } from '@nestjs/common';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {Round} from "../entity/round.entity";
import {WinningNumber} from "../entity/winning-number.entity";
import {RoundWinningNumberDto} from "../dto/round-winning-number.dto";

@Injectable()
export class RoundWinningNumberService {
    constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {}

    private baseQuery() {
        return this.entityManager
            .createQueryBuilder(Round, "ro")
            .innerJoin(WinningNumber, "wn", "wn.round_id = ro.id")
            .select("ro.id", "roundId")
            .addSelect("ro.game_id", "gameId")
            .addSelect("ro.turn_number", "turnNumber")
            .addSelect("ro.start_date", "startDate")
            .addSelect("ro.end_date", "endDate")
            .addSelect("ro.status", "roundStatus")
            .addSelect("ro.sale_start_date", "saleStartDate")
            .addSelect("ro.sale_end_date", "saleEndDate")
            .addSelect("ro.draw_start_date", "drawStartDate")
            .addSelect("ro.draw_end_date", "drawEndDate")
            .addSelect("ro.settling_start_date", "settlingStartDate")
            .addSelect("ro.settling_end_date", "settlingEndDate")
            .addSelect("ro.prize_start_date", "prizeStartDate")
            .addSelect("ro.prize_end_date", "prizeEndDate")
            .addSelect("ro.cycle_code", "cycleCode")
            .addSelect("wn.ball1", "winningBall1")
            .addSelect("wn.ball2", "winningBall2")
            .addSelect("wn.ball3", "winningBall3")
            .addSelect("wn.ball4", "winningBall4")
            .addSelect("wn.ball5", "winningBall5")
            .addSelect("wn.ball6", "winningBall6")
            .addSelect("wn.ball_bonus", "winningBallBonus");
    }

    async findByRoundId(roundId: number): Promise<RoundWinningNumberDto> {
        const queryBuilder = this.baseQuery();
        queryBuilder.where({ id: roundId });
        return queryBuilder.getRawOne<RoundWinningNumberDto>();
    }
}
