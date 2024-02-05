import {Injectable} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {Player} from "./player.entity";
import {EntityManager, Repository} from "typeorm";
import {PaginationMeta, TcpPaginationResponse} from "../common/microservice/TcpResponse";
import {TcpPaginationRequest} from "../common/microservice/TcpRequest";
import {FilterSort} from "../common/microservice/FromSearchFilter";
import {Ticket} from "../ticket/entity/ticket.entity";
import {Asset} from "../finance/entity/asset.entity";

@Injectable()
export class PlayerService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(Player) private readonly userRepository: Repository<Player>,
        @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    ) {}

    async findPlayerTotalList(request: TcpPaginationRequest<FilterSort>): Promise<TcpPaginationResponse<Player[]>> {
        const requestData = request.data as { [key: string]: any };
        const email = requestData.email as string | undefined;
        const orderByColumn = requestData.orderByColumn as string | undefined;
        const orderByDirection = requestData.orderByDirection as ("ASC" | "DESC") | undefined;
        const { offset, page } = request.pagination;

        const query = this.entityManager
            .createQueryBuilder(Player, "player")
            .innerJoinAndSelect(Asset, "asset", "asset.owner_id = user.id")
            .select("user")
            .addSelect("asset.balance", "balance");

        if (email) {
            query.andWhere("user.email LIKE :email", { email: `%${email}%` });
        }

        if (orderByColumn && orderByDirection) {
            query.orderBy(orderByColumn, orderByDirection);
        }

        const userCountData = await query.getCount();

        const result = await query
            .limit(offset)
            .offset((page - 1) * offset)
            .getRawMany();

        return TcpPaginationResponse.from<Player[], PaginationMeta>(
            result,
            PaginationMeta.from(userCountData, page, Math.ceil(userCountData / offset)),
        );
    }

}
