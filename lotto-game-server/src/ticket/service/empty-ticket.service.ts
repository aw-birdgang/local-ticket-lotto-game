import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {RoundService} from "../../game/service/round.service";
import {isEmpty} from "class-validator";
import {BusinessRpcException} from "../../common/exception/business-rpc-exception";
import {ErrorCodes} from "../../common/exception/error.enum";
import {EmptyTicket} from "../entity/empty-ticket.entity";
import {CreateEmptyTicketDto} from "../dto/create-empty-ticket.dto";

@Injectable()
export class EmptyTicketService {
    constructor(
        @InjectRepository(EmptyTicket) private ticketEmptyRepository: Repository<EmptyTicket>,
        private readonly roundService: RoundService
    ) {
    }

    findTicketEmptyById(ticketId: string) {
        return this.ticketEmptyRepository.findOneBy({ ticketId: ticketId });
    }

    findTicketEmptyListByOwnerId(ownerId: number) {
        return this.ticketEmptyRepository.findBy({ ownerId });
    }

    findTicketEmptyCountByOwnerId(ownerId: number) {
        return this.ticketEmptyRepository.countBy({ ownerId });
    }

    findTicketEmptyCountByRoundId(roundId: number) {
        return this.ticketEmptyRepository.countBy({ roundId });
    }

    async create(createEmptyTicketDto: CreateEmptyTicketDto) {
        const round = await this.roundService.findByGameIdAndTurnNumber(createEmptyTicketDto.gameId, createEmptyTicketDto.turnNumber);
        if (isEmpty(round)) {
            throw new BusinessRpcException(ErrorCodes.BUS_ERROR_002);
        }
        const ticketCurrencyId: number = 1;
        return this.ticketEmptyRepository.save<EmptyTicket>(EmptyTicket.from(createEmptyTicketDto.ticketId, createEmptyTicketDto.ownerId, round.id, ticketCurrencyId));
    }

    async delete(ticketId: string) {
        const updateResult = await this.ticketEmptyRepository.softDelete(ticketId);
        if (isEmpty(updateResult) || updateResult.affected <= 0) {
            console.log("cancel(delete) ticket 0 data modifications or errors -> ", ticketId, updateResult);
            // throw new BusinessRpcException(ErrorCodes.BUS_ERROR_009);
        }
    }
}
