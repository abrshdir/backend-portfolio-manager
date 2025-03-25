import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DemoAccount } from './demo-account.model';
import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

@Injectable()
export class DemoAccountService {
  private readonly aptos: Aptos;

  constructor(
    @InjectModel(DemoAccount.name)
    private readonly demoAccountModel: Model<DemoAccount>,
  ) {
    const config = new AptosConfig({ network: Network.DEVNET });
    this.aptos = new Aptos(config);
  }

  async getAccountByAddress(publicAddress: string) {
    try {
      return await this.demoAccountModel
        .findOne({ publicAddress })
        .exec();
    } catch (error) {
      throw new Error(`Failed to fetch account by address: ${error.message}`);
    }
  }

  async getAccountById(id: string) {
    try {
      return await this.demoAccountModel
        .findById(id)
        .exec();
    } catch (error) {
      throw new Error(`Failed to fetch account by ID: ${error.message}`);
    }
  }

  async createDemoAccount() {
    try {
      // Generate new account
      const account = Account.generate();
      
      // Fund with testnet tokens
      await this.aptos.fundAccount({
        accountAddress: account.accountAddress,
        amount: 100_000_000, // 0.1 APT
      });

      // Store only the necessary details
      const createdAccount = new this.demoAccountModel({
        publicAddress: account.accountAddress.toString(),
        privateKey: account.privateKey.toString(),
      });
      
      return await createdAccount.save();
    } catch (error) {
      throw new Error(`Failed to create on-chain account: ${error.message}`);
    }
  }

  // Add method to load account from stored private key
  async getAptosAccount(publicAddress: string) {
    const stored = await this.demoAccountModel.findOne({ publicAddress }).exec();
    return Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(stored!.privateKey)
    });
  }
}