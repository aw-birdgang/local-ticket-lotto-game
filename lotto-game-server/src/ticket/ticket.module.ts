import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {GameModule} from "../game/game.module";
import {FinanceModule} from "../finance/finance.module";
import {TicketCurrency} from "./entity/ticket-currency.entity";
import {EmptyTicket} from "./entity/empty-ticket.entity";
import {Ticket} from "./entity/ticket.entity";
import {IssuedTicket} from "./entity/issued-ticket.entity";
import {WinningTicket} from "./entity/winning-ticket.entity";
import {BundleTicket} from "./entity/bundle-ticket.entity";
import {TicketCurrencyService} from "./service/ticket-currency.service";
import {EmptyTicketService} from "./service/empty-ticket.service";
import {TicketService} from "./service/ticket.service";
import {BundleTicketService} from "./service/bundle-ticket.service";
import {WinningTicketService} from "./service/winning-ticket.service";
import {EmptyTicketController} from "./controller/empty-ticket.controller";
import {TicketController} from "./controller/ticket.controller";
import {WinningTicketController} from "./controller/winning-ticket.controller";
import {TicketIssueCurrencyService} from "./service/ticket-issue-currency.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([TicketCurrency, EmptyTicket, Ticket, IssuedTicket, WinningTicket, BundleTicket]),
        forwardRef(() => GameModule),
        forwardRef(() => FinanceModule),
    ],
    providers: [TicketCurrencyService, EmptyTicketService, TicketService, BundleTicketService, TicketIssueCurrencyService, WinningTicketService],
    controllers: [EmptyTicketController, TicketController, WinningTicketController],
    exports: [TicketCurrencyService, EmptyTicketService, TicketService, BundleTicketService, TicketIssueCurrencyService, WinningTicketService],
})
export class TicketModule {}
