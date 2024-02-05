import { Injectable } from '@nestjs/common';
import {Round} from "../entity/round.entity";
import {EntityManager, Repository} from "typeorm";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {GameService} from "./game.service";

@Injectable()
export class RoundService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(Round) private readonly roundRepository: Repository<Round>,
        private readonly gameService: GameService,
    ) {}


    findById(id: number): Promise<Round> {
        return this.roundRepository.findOneBy({ id });
    }

}
