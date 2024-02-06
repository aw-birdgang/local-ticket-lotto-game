import { Injectable } from '@nestjs/common';
import {TicketCurrency} from "../entity/ticket-currency.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class TicketCurrencyService {
    constructor(@InjectRepository(TicketCurrency) private ticketCurrencyRepository: Repository<TicketCurrency>) {}

    findById(id: number): Promise<TicketCurrency> {
        return this.ticketCurrencyRepository.findOneBy({ id: id });
    }
}
