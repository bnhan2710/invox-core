import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

export const ThrottlerProvider = ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    throttlers: [
      {
        ttl: configService.get<number>('THROTTLER_CONFIG.TTL') || 60000,
        limit: configService.get<number>('THROTTLER_CONFIG.LIMIT') || 1000,
      },
    ],
    errorMessage: 'Too many requests, please try again later.',
    storage: new ThrottlerStorageRedisService({
      host: configService.get<string>('REDIS_CONFIG.HOST'),
      port: configService.get<number>('REDIS_CONFIG.PORT'),
    }),
  }),
});
