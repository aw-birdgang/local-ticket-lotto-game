import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerUserService } from './player-user/player-user.service';
import { PlayerUserController } from './player-user/player-user.controller';
import { PlayerUserModule } from './player-user/player-user.module';
import { AdminUserModule } from './admin-user/admin-user.module';

@Module({
  imports: [PlayerUserModule, AdminUserModule],
  controllers: [AppController, PlayerUserController],
  providers: [AppService, PlayerUserService],
})
export class AppModule {}
