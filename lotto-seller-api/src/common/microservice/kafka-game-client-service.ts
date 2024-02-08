import {HttpStatus, Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {ClientKafka} from "@nestjs/microservices";
import {catchError, lastValueFrom, map} from "rxjs";
import {ClientHttpException} from "../exception/client-http-exception";
import {GameMessagePatterns} from "./game-message-pattern";
import {KafkaServer} from "./microservice.enum";
import {AccountMessagePatterns} from "./account-message-pattern";

@Injectable()
export class GameKafkaClientService implements OnModuleInit {
  constructor(
    @Inject(KafkaServer.KAFKA_GAME_SERVER) private readonly gameKafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    Object.values(GameMessagePatterns).map((pattern) => this.gameKafkaClient.subscribeToResponseOf(pattern));
    await this.gameKafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.gameKafkaClient.close();
  }

  send<TResult = any>(pattern: string | object, data: any): Promise<TResult> {
    console.log("kafka send  -> ", pattern, data);
    let cmd = "";
    if (typeof pattern === "string") {
      cmd = pattern;
    } else if (typeof pattern === "object") {
      cmd = pattern["cmd"];
    }
    return lastValueFrom(
      this.gameKafkaClient.send<TResult>(cmd, JSON.stringify(data)).pipe(
        map((value) => {
          console.log("kafka response value -> ", JSON.stringify(value));
          return value;
        }),
        catchError((error) => {
          console.log("kafka error ->", error);
          throw new ClientHttpException(HttpStatus.INTERNAL_SERVER_ERROR, error, null);
        }),
      )
    );
  }
}
