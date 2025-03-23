import { Module } from '@nestjs/common';
import { RealtimeController } from './realtime.controller';
import { RealtimeService } from './realtime.service';
import { HttpModule } from '@nestjs/axios';
import { AptosModule } from '../aptos/aptos.module';  // Add missing import

@Module({
  imports: [
    HttpModule,
    AptosModule  // Add AptosModule to imports
  ],
  controllers: [RealtimeController],
  providers: [RealtimeService],
  exports: [RealtimeService]
})
export class RealtimeModule {}