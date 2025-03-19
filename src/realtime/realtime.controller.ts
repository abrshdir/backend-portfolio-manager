import { Controller, Get } from "@nestjs/common";
import { RealtimeService } from "./realtime.service";

@Controller("realtime")
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) {}

  @Get("session")
  async createSession() {
    return this.realtimeService.createEphemeralKey();
  }
}