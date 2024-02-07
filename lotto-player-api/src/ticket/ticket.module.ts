import {forwardRef, Module} from '@nestjs/common';
import { TicketController } from './controller/ticket.controller';
import {CommonModule} from "../common/common.module";
import {TicketWinningMsaService} from "./service/ticket-winning.msa.service";
import {TicketMsaService} from "./service/ticket.msa.service";

@Module({
  imports: [forwardRef(() => CommonModule)],
  providers: [TicketMsaService, TicketWinningMsaService],
  controllers: [TicketController],
  exports: [TicketMsaService, TicketWinningMsaService],
})
export class TicketModule {}
