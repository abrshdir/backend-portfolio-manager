import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [RealtimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
