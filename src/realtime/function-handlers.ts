import { ar } from '@aptos-labs/ts-sdk/dist/common/accountAddress-jrha_M3l';
import { AptosService } from './aptos.service';
import { HttpService } from '@nestjs/axios';
import { DemoAccountService } from '../demo-account/demo-account.service';


export interface FunctionHandler {
  handle(name: string, args: any, callId: string): Promise<any>;
}

export class BalanceHandler implements FunctionHandler {
  constructor(
    private aptosService: AptosService,
  ) {}

  async handle(name: string, args: any) {
    if (!args.userId) throw new Error('User authentication required');
    return this.aptosService.getBalance(args.userId);
  }
}

export class TransactionHandler implements FunctionHandler {
  constructor(
    private aptosService: AptosService,
    private demoAccountService: DemoAccountService
  ) {}

  async handle(args: any) {
    if (!args.userId || !args.toAddress || !args.amount) {
      throw new Error('Missing required transaction parameters');
    }
    
    // Additional validation
    const account = await this.demoAccountService.getAccountById(args.userId);
    if (!account) throw new Error('User account not found');
    
    return this.aptosService.executeTransaction(
      args.userId,
      args.toAddress,
      args.amount
    );
  }
}

export class PriceChartHandler implements FunctionHandler {
  async handle(args: any) {
    // Just validate parameters and return activation signal
    return {
      status: 'success',
      action: 'update_chart',
      timeframe: args.timeframe || 'daily'
    };
  }
}
// Add additional handlers as needed