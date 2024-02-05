import { Injectable } from '@nestjs/common';
import {Game} from "../entity/game.entity";
import {EntityManager, Repository} from "typeorm";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class GameService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(Game) private gameRepository: Repository<Game>,
    ) {}

}
