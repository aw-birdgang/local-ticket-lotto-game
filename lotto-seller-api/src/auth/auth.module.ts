import {forwardRef, Module} from '@nestjs/common';
import {CommonModule} from "../common/common.module";
import {AccountModule} from "../account/account.module";
import {APP_GUARD} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";
import {AuthService} from "./service/auth.service";
import {AuthController} from "./controller/auth.controller";
import {AuthGuard} from "./guard/auth.guard";

@Module({
    imports: [forwardRef(() => CommonModule), forwardRef(() => AccountModule)],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        JwtService,
        AuthService,
    ],
    controllers: [AuthController],
    exports: [],
})
export class AuthModule {}
