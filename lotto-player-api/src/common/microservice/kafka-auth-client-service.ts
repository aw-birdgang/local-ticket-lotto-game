import {HttpStatus, Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {ClientKafka} from "@nestjs/microservices";
import {catchError, lastValueFrom, map} from "rxjs";
import {ClientHttpException} from "../exception/client-http-exception";
import {KafkaServer} from "./microservice.enum";
import {AuthMessagePatterns} from "./auth-message-pattern";

@Injectable()
export class AuthKafkaClientService implements OnModuleInit {
  constructor(
    @Inject(KafkaServer.KAFKA_AUTH_SERVER) private readonly authKafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    Object.values(AuthMessagePatterns).map((pattern) => this.authKafkaClient.subscribeToResponseOf(pattern));
    await this.authKafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.authKafkaClient.close();
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
      this.authKafkaClient.send<TResult>(cmd, JSON.stringify(data)).pipe(
        map((value) => {
          console.log("kafka response value -> ", JSON.stringify(value));
          return value;
        }),
        // catchError((error) => {
        //   console.log("kafka error ->", error);
        //   throw new ClientHttpException(HttpStatus.INTERNAL_SERVER_ERROR, error, null);
        // }),
      )
    );
  }
}
