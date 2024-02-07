import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "./auth.decorator";
import { AuthService } from "../service/auth.service";
import { ClientHttpException } from "../../common/exception/client-http-exception";
import { convertErrorMessage, ErrorCodes } from "../../common/exception/error.enum";
import { isEmpty, isNotEmpty } from "class-validator";
import {Payload} from "../dto";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("canActivate  start...");
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }
    // const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    // if (!requiredRoles) {
    //   return true;
    // }

    const request = context.switchToHttp().getRequest();
    const sessionUserId = this.extractSessionUserIdFromHeader(request);
    console.log("guard  sessionUserId -> ", sessionUserId);
    if (isNotEmpty(sessionUserId)) {
      const payload = new Payload();
      payload.username = sessionUserId;
      payload.sub = sessionUserId;
      request["user"] = payload;
      return true;
    }
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ClientHttpException(HttpStatus.UNAUTHORIZED, convertErrorMessage(ErrorCodes.AUT_ERROR_003), null);
    }
    try {
      const payload = await this.authService.tokenVerify(token);
      console.log("token payload -> ", payload);
      request["user"] = payload;
    } catch {
      throw new ClientHttpException(HttpStatus.UNAUTHORIZED, convertErrorMessage(ErrorCodes.AUT_ERROR_003), null);
    }
    // return requiredRoles.some((role) => request.user.roles?.includes(role));
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // console.log("extractTokenFromHeader -> ", request.headers);
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  private extractSessionUserIdFromHeader(request: Request): string | undefined {
    const sessionUserId = request.headers.x_session_user_id;
    return isEmpty(sessionUserId) ? undefined : sessionUserId.toString();
  }
}
