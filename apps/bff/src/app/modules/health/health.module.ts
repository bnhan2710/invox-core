import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthHttpController } from './presetation/health.http-controller';
import { HealthService } from './services/health.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthHttpController],
  providers: [HealthService],
})
export class HealthModule {}
