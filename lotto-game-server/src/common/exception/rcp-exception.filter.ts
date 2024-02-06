import {ArgumentsHost, Catch, Logger, RpcExceptionFilter} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch(RpcException)
export class MicroserviceRcpExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(MicroserviceRcpExceptionFilter.name);
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToRpc();
    this.logger.log("ctx.getContext -> ", ctx.getContext());
    return throwError(() => exception.getError());
  }
}
