import { Controller, Get, Post, Body } from "@nestjs/common";
import { RealtimeService } from "./realtime.service";

@Controller("realtime")
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) {}

  @Get("session")
  async createSession() {
    return this.realtimeService.createEphemeralKey();
  }

  @Post("submit-function-result")
  async submitFunctionResult(@Body() resultData: {
    call_id: string;
    name: string;
    content: string;
  }) {
    return this.realtimeService.submitFunctionResult(resultData);
  }

  @Post("execute-function")
  async executeFunction(@Body() data: {
    name: string;
    args: any;
    callId: string;
  }) {
    // Add missing slash in path to match NestJS convention
    return this.realtimeService.executeFunctionCall(data.name, data.args, data.callId);
  }
}