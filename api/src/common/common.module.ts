import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from './controllers/health.controller';
import { DbHealthService } from './services/db-health.service';
import { MailerService } from './services/mailer.service';

@Module({
  imports: [MongooseModule],
  controllers: [HealthController],
  providers: [DbHealthService, MailerService],
  exports: [MailerService],
})
export class CommonModule {}
