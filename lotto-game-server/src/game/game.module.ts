import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommonModule} from "../common/common.module";
import {TicketModule} from "../ticket/ticket.module";
import {Game} from "./entity/game.entity";
import {GameWinningRule} from "./entity/game-winning-rule.entity";
import {Round} from "./entity/round.entity";
import {WinningNumber} from "./entity/winning-number.entity";
import {BatchJob} from "./entity/batch-job.entity";
import {BatchRoundAggregation} from "./entity/batch-round-aggregation.entity";
import {BatchRoundRanking} from "./entity/batch-round-ranking.entity";
import {GameService} from "./service/game.service";
import {RoundService} from "./service/round.service";
import {GameWinningRuleService} from "./service/game-winning-rule.service";
import {WinningNumberService} from "./service/winning-number.service";
import {RoundWinningNumberService} from "./service/round-winning-number.service";
import {BatchJobService} from "./service/batch-job.service";
import {BatchAggregationService} from "./service/batch-aggregation.service";
import { GameController } from './controller/game.controller';
import {RoundController} from "./controller/round.controller";
import {BatchController} from "./controller/batch.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Game, GameWinningRule, Round, WinningNumber, BatchJob, BatchRoundAggregation, BatchRoundRanking]),
        forwardRef(() => CommonModule),
        forwardRef(() => TicketModule),
    ],
    providers: [
        GameService,
        GameWinningRuleService,
        RoundService,
        WinningNumberService,
        RoundWinningNumberService,
        BatchJobService,
        BatchAggregationService,
    ],
    controllers: [GameController, RoundController, BatchController],
    exports: [
        GameService,
        GameWinningRuleService,
        RoundService,
        WinningNumberService,
        RoundWinningNumberService,
        BatchJobService,
        BatchAggregationService,
    ],
})
export class GameModule {}
