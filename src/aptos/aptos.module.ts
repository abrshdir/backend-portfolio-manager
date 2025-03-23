import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AptosService } from 'src/realtime/aptos.service';

@Module({
    imports: [HttpModule],  // Add HttpModule here
    providers: [AptosService],
    exports: [AptosService]  // Ensure service is exported
})
export class AptosModule { }