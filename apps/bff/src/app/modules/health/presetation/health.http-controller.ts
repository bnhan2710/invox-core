import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from '../services/health.service';

@Controller('health')
@ApiTags('Health')
export class HealthHttpController {
  constructor(private readonly healthService: HealthService) {}

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness Probe' })
  @HealthCheck()
  checkLiveness() {
    return this.healthService.checkMemoryHeap();
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness Probe' })
  @HealthCheck()
  checkReadiness() {
    return this.healthService.checkReadiness();
  }

  @Get('startup')
  @ApiOperation({ summary: 'Startup Probe' })
  @HealthCheck()
  checkStartup() {
    return this.healthService.checkStartup();
  }
}
