import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountService } from './account/service/account.service';
import { AccountController } from './account/controller/account.controller';
import { AccountModule } from './account/account.module';
import { ClientRegisterMsService } from './account/service/client-register.ms.service';
import { AuthService } from './auth/service/auth.service';
import { AuthController } from './auth/controller/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AccountModule, AuthModule],
  controllers: [AppController, AccountController, AuthController],
  providers: [AppService, AccountService, ClientRegisterMsService, AuthService],
})
export class AppModule {}
