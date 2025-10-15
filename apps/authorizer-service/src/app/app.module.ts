import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { KeycloakModule } from './modules/keycloak/keycloak.module';
import { AuthorizerModule } from './modules/authorizer/authorizer.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }), KeycloakModule, AuthorizerModule],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
