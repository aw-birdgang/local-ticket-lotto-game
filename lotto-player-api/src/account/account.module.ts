import {forwardRef, Module} from '@nestjs/common';
import {CommonModule} from "../common/common.module";
import {TicketModule} from "../ticket/ticket.module";
import {FinanceModule} from "../finance/finance.module";
import {AccountMsaService} from "./service/account.msa.service";
import {ClientRegisterMsaService} from "./service/client-register.msa.service";
import {AccountController} from "./controller/account.controller";

@Module({
    imports: [forwardRef(() => CommonModule), forwardRef(() => TicketModule), forwardRef(() => FinanceModule)],
    providers: [AccountMsaService, ClientRegisterMsaService],
    controllers: [AccountController],
    exports: [AccountMsaService, ClientRegisterMsaService],
})
export class AccountModule {}
