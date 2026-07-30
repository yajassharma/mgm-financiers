import { Controller, Get } from '@nestjs/common';
import { DbHealthService } from '../services/db-health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly dbHealth: DbHealthService) {}
  @Get('db') getDb() {
    return this.dbHealth.checkConnection();
  }
}
