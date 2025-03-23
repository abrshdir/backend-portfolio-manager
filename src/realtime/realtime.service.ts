import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { allTools } from 'src/config/all-tools';
import { FunctionHandler, BalanceHandler, TransactionHandler, PriceChartHandler } from './function-handlers';
import { AptosService } from './aptos.service';

@Injectable()
export class RealtimeService {
  private functionHandlers: Map<string, FunctionHandler>;

  constructor(
    private readonly httpService: HttpService,
    private readonly aptosService: AptosService
  ) {
    this.functionHandlers = new Map<string, FunctionHandler>([
      ['getBalance', new BalanceHandler(aptosService)],
      ['executeTransaction', new TransactionHandler(aptosService)],
      ['AptosGetTokenPriceTool', new PriceChartHandler()]
    ]);
  }

  async createEphemeralKey() {
    const url = 'https://api.openai.com/v1/realtime/sessions';
    const payload = {
      model: 'gpt-4o-realtime-preview-2024-12-17',
      voice: 'alloy',
      input_audio_transcription: {
        "model": "whisper-1",
        "language": 'en', // Add language specification here
      },
      tools: [...allTools] // Add tools to session configuration
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use your standard API key
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data; // Return the ephemeral key and session details
    } catch (error) {
      console.error(
        'Error generating ephemeral key:',
        JSON.stringify({
          message: error.message,
          status: error.response?.status,
          data: error.isAxiosError ? error.response?.data : error.message
        }, null, 2)
      );
      throw new Error(`Failed to generate ephemeral key: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async submitFunctionResult(payload: any) {
    try {
      // The correct endpoint for submitting function results in Realtime API
      return await firstValueFrom(
        this.httpService.post(
          `https://api.openai.com/v1/realtime/function_results`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );
    } catch (error) {
      console.error('Failed to submit function result:', error);
      throw new Error('OpenAI API communication failed');
    }
  }

  async executeFunctionCall(name: string, args: any, callId: string) {
    // Properly get handler from map and execute
    const handler = this.functionHandlers.get(name);
    if (handler) {
      return handler.handle(name, args, callId);
    }
    throw new Error(`Unsupported function: ${name}`);
  }

}
