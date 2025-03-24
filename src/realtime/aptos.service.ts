import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  SimpleTransaction,
  PrivateKeyVariants,
} from '@aptos-labs/ts-sdk';
import { EncryptionConfig } from '../config/encryption.config';
import { PrivateKey } from '@aptos-labs/ts-sdk';
import { HttpService } from '@nestjs/axios';
import { interval } from 'rxjs';
import { AgentRuntime, createAptosTools } from 'move-agent-kit';

// Define a type for the coin resource data
interface CoinResourceData {
  coin: {
    value: string;
  };
}
const APTOS_COIN = '0x1::aptos_coin::AptosCoin';
const COIN_STORE = `0x1::coin::CoinStore<${APTOS_COIN}>`;

@Injectable()
export class AptosService {
  private client: Aptos;

  constructor(private readonly httpService: HttpService) {
    const config = new AptosConfig({ network: Network.DEVNET });
    this.client = new Aptos(config);

    // const signer = new LocalSigner(account, Network.MAINNET);
    // const agent = new AgentRuntime(signer, aptos, {
    //   PANORA_API_KEY: process.env.PANORA_API_KEY, // optional
    //   OPENAI_API_KEY: process.env.OPENAI_API_KEY // optional
    // });
    // const tools = createAptosTools(aptosAgent);

    // const result = agent.getTokenPrice("to_address", 1.0)
  }
  async getBalance(
    address: '0xbb05d8096eb64813c2186948def087dd782d86daf6a976cb44ba8098f935ccd0',
    coinType: string = '0x1::aptos_coin::AptosCoin',
  ): Promise<string> {
    try {
      const resources = await this.client.getAccountResources({
        accountAddress: address,
      });
      const coinResource = resources.find(
        (r) => r.type === `0x1::coin::CoinStore<${coinType}>`,
      );

      // Safely check if the resource has the expected structure
      if (
        coinResource &&
        'data' in coinResource &&
        typeof coinResource.data === 'object' &&
        coinResource.data !== null
      ) {
        const coinData = coinResource.data as CoinResourceData;
        return coinData.coin?.value
      }

      return '0'; // Return '0' if the resource is not found or does not match the expected structure
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  createAccount(): {
    address: string;
    encryptedPrivateKey: string;
  } {
    // Generate a random private key
    const privateKey = Ed25519PrivateKey.generate();
    const account = Account.fromPrivateKey({ privateKey });
    const encryptedPrivateKey = EncryptionConfig.encrypt(privateKey.toString());

    return {
      address: account.accountAddress.toString(),
      encryptedPrivateKey,
    };
  }

  async prepareTransaction(
    fromAddress: string,
    toAddress: string,
    amount: number,
    encryptedPrivateKey: string,
  ): Promise<SimpleTransaction> {
    try {
      const privateKeyStr = EncryptionConfig.decrypt(encryptedPrivateKey);
      const privateKey = new Ed25519PrivateKey(privateKeyStr);
      const account = Account.fromPrivateKey({ privateKey });

      const transaction = await this.client.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: '0x1::coin::transfer',
          typeArguments: ['0x1::aptos_coin::AptosCoin'],
          functionArguments: [toAddress, amount.toString()], // Ensure amount is a string
        },
      });
      return transaction;
    } catch (error) {
      throw new HttpException(
        `Failed to prepare transaction: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async executeTransaction(
    fromAddress: string,
    toAddress: string,
    amount: number,
    encryptedPrivateKey: string,
  ): Promise<Object> {
    try {
      const privateKeyStr = EncryptionConfig.decrypt(encryptedPrivateKey);
      const formattedPrivateKey = PrivateKey.formatPrivateKey(
        privateKeyStr,
        PrivateKeyVariants.Ed25519,
      );
      const privateKey = new Ed25519PrivateKey(formattedPrivateKey);

      const account = Account.fromPrivateKey({ privateKey });

      const transaction = await this.prepareTransaction(
        fromAddress,
        toAddress,
        amount,
        encryptedPrivateKey,
      );

      interval(2000);

      const signedTxn = await this.client.signAndSubmitTransaction({
        signer: account,
        transaction: transaction,
      });

      await this.client.waitForTransaction({ transactionHash: signedTxn.hash });

      // balance check
      const newAccountFromAddress = await this.client.getAccountResource({
        accountAddress: fromAddress,
        resourceType: COIN_STORE,
      });

      const newSenderBalance = Number(newAccountFromAddress.coin.value);

      const newAccountToAddress = await this.client.getAccountResource({
        accountAddress: toAddress,
        resourceType: COIN_STORE,
      });

      const newRecieverBalance = Number(newAccountToAddress.coin.value);

      // Return the transaction hash and updated account balances
      return {
        status: 'Success',
        TxHash: signedTxn.hash,
        SenderAccountBalance: newSenderBalance,
        ReceiverAccountBalance: newRecieverBalance,
      };
    } catch (error) {
      throw new HttpException(
        `Transaction failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fundAccount(address: string): Promise<{ transactionHash: string }> {
    try {
      // Use the SDK's fundAccount method
      const response = await this.client.fundAccount({
        accountAddress: address,
        amount: 100000000, // 1 APT (in octas)
      });

      // The response contains the transaction hash
      const transactionHash = response[0]; // fundAccount returns an array of transaction hashes
      return { transactionHash };
    } catch (error) {
      throw new HttpException(
        `Failed to fund account: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
