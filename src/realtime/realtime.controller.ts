import { Controller, Get, Post, Body, Headers, BadRequestException } from "@nestjs/common";
import { RealtimeService } from "./realtime.service";

@Controller("realtime")
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) { }

  @Get("session")
  async createSession(@Headers('x-openai-key') openaiKey: string) {
    if (!openaiKey) {
      throw new BadRequestException('OpenAI API key is required');
    }
    return this.realtimeService.createEphemeralKey(openaiKey);
  }

  @Post("submit-function-result")
  async submitFunctionResult(@Body() resultData: {
    call_id: string;
    name: string;
    content: string;
  }, @Headers('x-openai-key') openaiKey: string) {
    return this.realtimeService.submitFunctionResult(resultData, openaiKey);
  }

  @Post("execute-function")
  async executeFunction(
    @Body() data: {
      name: string;
      args: any;
      callId: string;
      sessionId: string;
    },
    @Headers('x-openai-key') openaiKey: string
  ) {
    if (!openaiKey) {
      throw new BadRequestException('OpenAI API key is required');
    }
    return this.realtimeService.executeFunctionCall(data.name, data.args, data.callId, data.sessionId);
  }
}