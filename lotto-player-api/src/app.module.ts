import {Module} from '@nestjs/common';
import {GameModule} from './game/game.module';
import {AuthModule} from './auth/auth.module';
import {AccountModule} from './account/account.module';
import {TicketModule} from './ticket/ticket.module';
import {FinanceModule} from './finance/finance.module';
import {CommonModule} from "./common/common.module";
import { RoundMsaService } from './round/service/round.msa.service';
import { RoundController } from './round/controller/round.controller';
import { RoundModule } from './round/round.module';

@Module({
  imports: [CommonModule, AuthModule, AccountModule, GameModule, RoundModule, TicketModule, FinanceModule],
  providers: [RoundMsaService],
  controllers: [RoundController],
})
export class AppModule {}
