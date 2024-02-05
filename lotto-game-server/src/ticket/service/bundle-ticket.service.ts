import {Injectable} from '@nestjs/common';
import {BundleTicket} from "../entity/bundle-ticket.entity";
import {EntityManager, Repository} from "typeorm";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {TicketService} from "./ticket.service";
import {PlayerService} from "../../player/player.service";
import {TicketCurrencyService} from "./ticket-currency.service";
import {TcpPaginationRequest} from "../../common/microservice/TcpRequest";
import {PaginationMeta, TcpPaginationResponse} from "../../common/microservice/TcpResponse";
import {BundleTicketDto} from "../dto/bundle-ticket.dto";
import {RoundService} from "../../game/service/round.service";
import {BundleTicketDetailsDto} from "../dto/bundle-ticket-details.dto";
import {isEmpty} from "class-validator";

@Injectable()
export class BundleTicketService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(BundleTicket) private bundleTicketRepository: Repository<BundleTicket>,
        private readonly ticketService: TicketService,
        private readonly playerService: PlayerService,
        private readonly roundService: RoundService,
        private readonly ticketCurrencyService: TicketCurrencyService,
    ) {}

    findBundleTicketById(id: string): Promise<BundleTicket> {
        return this.bundleTicketRepository.findOneBy({ id });
    }

    findFilteredBundleTicketById(id: string, orderDate?: string): Promise<BundleTicket> {
        return this.bundleTicketRepository.createQueryBuilder().select().where("id = :id", { id: id }).orderBy("purchase_date", "ASC").getOne();
    }

    async findBundleTicketPaginationByOwnerId(request: TcpPaginationRequest<number>): Promise<TcpPaginationResponse<BundleTicketDto[]>> {
        const [bundleTicketList, total] = await this.bundleTicketRepository.findAndCount({
            where: { ownerId: request.data[0].filter.ownerId },
            order: { purchaseDate: request.data[0].sort.transactionDate },
            take: request.pagination.offset,
            skip: (request.pagination.page - 1) * request.pagination.offset,
        });

        const bundleTicketDtoList = await Promise.all(bundleTicketList.map(async (bundleTicket) => bundleTicket.toBundleTicketDto()));
        return TcpPaginationResponse.from<BundleTicketDto[]>(
            bundleTicketDtoList,
            PaginationMeta.from(total, request.pagination.page, Math.ceil(total / request.pagination.offset)),
        );
    }


    async findBundleTicketDetailById(bundleTicketId: string): Promise<BundleTicketDetailsDto> {
        const bundleTicket = await this.findBundleTicketById(bundleTicketId);

        if (isEmpty(bundleTicket)) {
            return null;
        }
        const ticketDetailList = await this.ticketService.findTicketDetailListByBundleTicketId(bundleTicket.id);
        const roundId = ticketDetailList[0].ticketDto.roundId;
        const roundInfo = await this.roundService.findById(roundId);

        return BundleTicketDetailsDto.from(bundleTicket.toBundleTicketDto(), ticketDetailList, roundInfo);
    }

}
