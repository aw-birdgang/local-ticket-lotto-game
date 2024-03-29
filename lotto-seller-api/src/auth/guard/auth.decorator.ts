import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import {Role} from "../entity/auth.enum";

export const IS_PUBLIC_KEY = "isPublic";
export const ROLES_KEY = "roles";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return data ? request.cookies?.[data] : request.cookies;
});
