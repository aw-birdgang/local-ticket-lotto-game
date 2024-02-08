import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, lastValueFrom } from "rxjs";
import { ClientHttpException } from "../exception/client-http-exception";
import { TcpServices } from "./MicroserviceTcpClient";

@Injectable()
export class TcpClientService {
  constructor(
    @Inject(TcpServices.LOTTO_GAME_SERVER) private readonly lottoClient: ClientProxy,
    @Inject(TcpServices.LOTTO_AUTH_SERVER) private readonly authClient: ClientProxy,
  ) {}

  send<TResult = any>(pattern: string | object, data: any): Promise<TResult> {
    console.log("send  -> ", pattern, data);
    let cmd = "";
    if (typeof pattern === "string") {
      cmd = pattern;
    } else if (typeof pattern === "object") {
      cmd = pattern["cmd"];
    }
    return lastValueFrom(
      this.lottoClient.send<TResult>({ cmd }, data).pipe(
        catchError((error) => {
          console.log("Handling error locally and rethrowing it...", error);
          throw new ClientHttpException(HttpStatus.INTERNAL_SERVER_ERROR, error, null);
        }),
      ),
    );
  }

  authSend<TResult = any>(pattern: string | object, data: any): Promise<TResult> {
    console.log("authSend  -> ", pattern, data);
    let cmd = "";
    if (typeof pattern === "string") {
      cmd = pattern;
    } else if (typeof pattern === "object") {
      cmd = pattern["cmd"];
    }
    return lastValueFrom(
      this.authClient.send<TResult>({ cmd }, data).pipe(
        catchError((error) => {
          console.log("Handling error locally and rethrowing it...", error);
          throw new ClientHttpException(HttpStatus.INTERNAL_SERVER_ERROR, error, null);
        }),
      ),
    );
  }
}
