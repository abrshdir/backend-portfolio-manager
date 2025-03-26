import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { DemoAccount, DemoAccountSchema } from './demo-account/demo-account.model';
import { DemoAccountController } from './demo-account/demo-account.controller';
import { RealtimeController } from './realtime/realtime.controller';
import { DemoAccountService } from './demo-account/demo-account.service';
import { RealtimeService } from './realtime/realtime.service';
import { AptosService } from './realtime/aptos.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    MongooseModule.forFeature([{ name: DemoAccount.name, schema: DemoAccountSchema }]),
    // Remove RealtimeModule import
  ],
  controllers: [DemoAccountController, RealtimeController],
  providers: [
    DemoAccountService,
    RealtimeService,
    AptosService,
  ],
})
export class AppModule { }
