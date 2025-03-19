import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RealtimeController } from './realtime.controller';
import { RealtimeService } from './realtime.service';

@Module({
  imports: [HttpModule],
  controllers: [RealtimeController],
  providers: [RealtimeService],
})
export class RealtimeModule {}