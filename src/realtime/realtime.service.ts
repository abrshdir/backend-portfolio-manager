import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RealtimeService {
  constructor(private readonly httpService: HttpService) { }

  async createEphemeralKey() {
    const url = 'https://api.openai.com/v1/realtime/sessions';
    const payload = {
      model: 'gpt-4o-realtime-preview-2024-12-17', // Specify the model
      voice: 'alloy', // Specify the voice
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
        error.response?.data || error.message,
      );
      throw new Error('Failed to generate ephemeral key');
    }
  }
}
