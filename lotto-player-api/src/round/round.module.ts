import {forwardRef, Module} from '@nestjs/common';
import {CommonModule} from "../common/common.module";
import {RoundMsaService} from "./service/round.msa.service";
import {RoundController} from "./controller/round.controller";

@Module({
    imports: [forwardRef(() => CommonModule)],
    providers: [RoundMsaService],
    controllers: [RoundController],
    exports: [RoundMsaService],
})
export class RoundModule {}
