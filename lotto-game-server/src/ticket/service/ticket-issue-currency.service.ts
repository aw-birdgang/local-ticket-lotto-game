import { Injectable } from '@nestjs/common';
import {InjectEntityManager} from "@nestjs/typeorm";
import {EntityManager} from "typeorm";
import {Ticket} from "../entity/ticket.entity";
import {IssuedTicket} from "../entity/issued-ticket.entity";
import {TicketCurrency} from "../entity/ticket-currency.entity";
import {TicketIssueCurrencyDto} from "../dto/ticket-issue-currency.dto";

@Injectable()
export class TicketIssueCurrencyService {
    constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {}

    private baseQuery() {
        return this.entityManager
            .createQueryBuilder(Ticket, "tt")
            .innerJoin(IssuedTicket, "it", "it.ticket_id = tt.id")
            .innerJoin(TicketCurrency, "tc", "tc.id = tt.ticket_currency_id")
            .select("tt.id", "ticketId")
            .addSelect("tt.bundle_ticket_id", "bundleTicketId")
            .addSelect("tt.owner_id", "ownerId")
            .addSelect("tt.round_id", "roundId")
            .addSelect("tt.status", "ticketStatus")
            .addSelect("tt.ticket_currency_id", "ticketCurrencyId")
            .addSelect("tc.currency_code", "currencyCode")
            .addSelect("tc.amount", "ticketCurrencyAmount")
            .addSelect("it.issue_date", "issueDate")
            .addSelect("it.ball1", "ball1")
            .addSelect("it.ball2", "ball2")
            .addSelect("it.ball3", "ball3")
            .addSelect("it.ball4", "ball4")
            .addSelect("it.ball5", "ball5")
            .addSelect("it.ball6", "ball6")
            .addSelect("it.expire_date", "expireDate");
    }

    async findByTicketId(ticketId: string): Promise<TicketIssueCurrencyDto> {
        const queryBuilder = this.baseQuery();
        queryBuilder.where({ id: ticketId });
        return queryBuilder.getRawOne<TicketIssueCurrencyDto>();
    }
}
