import {forwardRef, Module} from '@nestjs/common';
import {CommonModule} from "../common/common.module";
import {GameMsaService} from "./service/game.msa.service";
import {GameController} from "./controller/game.controller";

@Module({
    imports: [forwardRef(() => CommonModule)],
    providers: [GameMsaService],
    controllers: [GameController],
    exports: [GameMsaService],
})
export class GameModule {}
