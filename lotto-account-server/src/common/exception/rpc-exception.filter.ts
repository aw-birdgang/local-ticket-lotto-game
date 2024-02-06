import { ArgumentsHost, Catch, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch(RpcException)
export class MicroserviceRpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    // const ctx = host.switchToRpc();
    // console.log("ctx.getData -> ", ctx.getData());
    // console.log("ctx.getContext -> ", ctx.getContext());
    // console.log("exception.getError -> ", exception.getError());
    return throwError(() => exception.getError());
  }
}
