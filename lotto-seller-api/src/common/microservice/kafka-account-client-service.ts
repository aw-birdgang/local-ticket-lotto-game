import {HttpStatus, Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {ClientKafka} from "@nestjs/microservices";
import {catchError, firstValueFrom, lastValueFrom, map} from "rxjs";
import {ClientHttpException} from "../exception/client-http-exception";
import {KafkaServer} from "./microservice.enum";
import {AccountMessagePatterns} from "./account-message-pattern";

@Injectable()
export class AccountKafkaClientService implements OnModuleInit {
  constructor(
    @Inject(KafkaServer.KAFKA_ACCOUNT_SERVER) private readonly accountKafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    Object.values(AccountMessagePatterns).map((pattern) => this.accountKafkaClient.subscribeToResponseOf(pattern));
    await this.accountKafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.accountKafkaClient.close();
  }

  send<TResult = any>(pattern: string | object, data: any): Promise<TResult> {
    console.log("kafka send  -> ", pattern, data);
    let cmd = "";
    if (typeof pattern === "string") {
      cmd = pattern;
    } else if (typeof pattern === "object") {
      cmd = pattern["cmd"];
    }

    // const result$ = this.accountKafkaClient.send<TResult>(cmd, JSON.stringify(data));
    // result$.subscribe({
    //   next: (data: TResult) => {
    //     console.log("kafka subscribe data -> ", data);
    //     return data;
    //   },
    //   error: (error) => {
    //     console.log("Handling error locally and rethrowing it...", error);
    //     throw new ClientHttpException(HttpStatus.INTERNAL_SERVER_ERROR, error, null);
    //   }
    // })

    return lastValueFrom(
      this.accountKafkaClient.send<TResult>(cmd, JSON.stringify(data)).pipe(
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
