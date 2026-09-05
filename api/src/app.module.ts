import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { UserAuthModule } from './auth/user/user-auth.module';
import { AdminAuthModule } from './auth/admin/admin-auth.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { ConsentsModule } from './consents/consents.module';
import { GrievancesModule } from './grievances/grievances.module';
import { PaymentsModule } from './payments/payments.module';
import { LeadsModule } from './leads/leads.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('mongoUri'),
        autoIndex: false,
      }),
    }),
    CommonModule,
    AdminModule,
    UsersModule,
    UserAuthModule,
    AdminAuthModule,
    ConsentsModule,
    GrievancesModule,
    PaymentsModule,
    LeadsModule,
    AnalyticsModule,
    SiteSettingsModule,
    NotificationsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
