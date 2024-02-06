import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AssetService} from "./service/asset.service";
import {AssetTransactionService} from "./service/asset-transaction.service";
import {PrizePayoutService} from "./service/prize-payout.service";
import {GameModule} from "../game/game.module";
import {TicketModule} from "../ticket/ticket.module";
import {Asset} from "./entity/asset.entity";
import {AssetTransaction} from "./entity/asset-transaction.entity";
import {PrizePayout} from "./entity/prize-payout.entity";
import {AssetController} from "./controller/asset.controller";
import {AssetTransactionController} from "./controller/asset-transaction.controller";
import {PrizePayoutController} from "./controller/prize-payout.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, AssetTransaction, PrizePayout]),
    forwardRef(() => GameModule),
    forwardRef(() => TicketModule),
  ],
  providers: [AssetService, AssetTransactionService, PrizePayoutService],
  controllers: [AssetController, AssetTransactionController, PrizePayoutController],
  exports: [AssetService, AssetTransactionService, PrizePayoutService],
})
export class FinanceModule {}
