import {Injectable} from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {Ticket} from "../entity/ticket.entity";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {BundleTicket} from "../entity/bundle-ticket.entity";
import {IssuedTicket} from "../entity/issued-ticket.entity";
import {WinningTicket} from "../entity/winning-ticket.entity";
import {PlayerService} from "../../player/player.service";
import {isEmpty} from "class-validator";

@Injectable()
export class TicketService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
        @InjectRepository(BundleTicket) private bundleTicketRepository: Repository<BundleTicket>,
        @InjectRepository(IssuedTicket) private issuedTicketRepository: Repository<IssuedTicket>,
        @InjectRepository(WinningTicket) private winningTicketRepository: Repository<WinningTicket>,
        private readonly playerService: PlayerService,
    ) {}

    findTicketById(ticketId: string): Promise<Ticket> {
        return this.ticketRepository.findOneBy({ id: ticketId });
    }

    findTicketListByOwnerId(ownerId: number): Promise<Ticket[]> {
        return this.ticketRepository.findBy({ ownerId });
    }

    findIssuedTicketById(ticketId: string): Promise<IssuedTicket> {
        return this.issuedTicketRepository.findOneBy({ ticketId });
    }

    findWinningTicketById(ticketId: string): Promise<WinningTicket> {
        return this.winningTicketRepository.findOneBy({ ticketId });
    }

    findTicketListByBundleTicketId(bundleTicketId: string): Promise<Ticket[]> {
        return this.ticketRepository.findBy({ bundleTicketId });
    }

    findTicketCountByOwnerId(ownerId: number): Promise<number> {
        return this.ticketRepository.countBy({ ownerId });
    }

    findTicketCountByRoundId(roundId: number): Promise<number> {
        return this.ticketRepository.countBy({ roundId });
    }

    async findTicketDetailListByBundleTicketId(bundleTicketId: string) {
        const ticketList = await this.findTicketListByBundleTicketId(bundleTicketId);
        if (isEmpty(ticketList)) {
            return null;
        }
    }

}
