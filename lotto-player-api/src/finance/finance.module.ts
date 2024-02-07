import {forwardRef, Module} from '@nestjs/common';
import {CommonModule} from "../common/common.module";
import {AssetMsaService} from "./service/msa/asset.msa.service";
import {AssetTransactionMsaService} from "./service/msa/asset-transaction.msa.service";
import {PrizePayoutMsaService} from "./service/msa/prize-payout.msa.service";
import {PrizePayoutController} from "./controller/prize-payout.controller";

@Module({
    imports: [forwardRef(() => CommonModule)],
    providers: [AssetMsaService, AssetTransactionMsaService, PrizePayoutMsaService],
    controllers: [PrizePayoutController],
    exports: [AssetMsaService, AssetTransactionMsaService, PrizePayoutMsaService],
})
export class FinanceModule {}
