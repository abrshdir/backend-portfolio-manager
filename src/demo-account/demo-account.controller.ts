import { Body, Get, Controller, Post, Param, HttpException } from '@nestjs/common';
import { DemoAccountService } from './demo-account.service';

@Controller('demo-account')
export class DemoAccountController {
    constructor(private readonly demoAccountService: DemoAccountService) { }

    @Post('/')
    async createDemoAccount(@Body() body: { publicAddress: string; privateKey: string }) {
        return this.demoAccountService.createDemoAccount();
    }


    @Get(':address')
    async getAccountByAddress(@Param('address') address: string) {
        const account = await this.demoAccountService.getAccountByAddress(address);
        if (!account) {
            throw new HttpException('Account not found', 404);
        }
        return account;
    }

    @Get('user/:userId')  // 👈 Add this endpoint
    async getAccountById(@Param('userId') userId: string) {
        const account = await this.demoAccountService.getAccountById(userId);
        if (!account) {
            throw new HttpException('Account not found', 404);
        }
        return account;
    }
}