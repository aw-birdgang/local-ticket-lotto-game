import {forwardRef, Module} from '@nestjs/common';
import {CommonModule} from "./common/common.module";
import {TicketModule} from "./ticket/ticket.module";
import {GameModule} from "./game/game.module";
import {FinanceModule} from "./finance/finance.module";

@Module({
    imports: [
        forwardRef(() => CommonModule),
        forwardRef(() => GameModule),
        forwardRef(() => TicketModule),
        forwardRef(() => FinanceModule),
    ],
})
export class AppModule {}
