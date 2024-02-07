import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {catchError, lastValueFrom} from "rxjs";
import {ClientHttpException} from "../exception/client-http-exception";
import {TcpServer} from "./microservice.enum";

@Injectable()
export class GameTcpClientService {
  constructor(@Inject(TcpServer.TCP_GAME_SERVER) private readonly gameTcpClient: ClientProxy) {}

  send<TResult = any>(pattern: string | object, data: any): Promise<TResult> {
    console.log("send  -> ", pattern, data);
    let cmd = "";
    if (typeof pattern === "string") {
      cmd = pattern;
    } else if (typeof pattern === "object") {
      cmd = pattern["cmd"];
    }
    return lastValueFrom(
      this.gameTcpClient.send<TResult>({cmd}, data).pipe(
        // catchError((error) => {
        //   console.log("Handling error locally and rethrowing it...", error);
        //   throw new ClientHttpException(HttpStatus.INTERNAL_SERVER_ERROR, error, null);
        // }),
      ),
    );
  }
}
