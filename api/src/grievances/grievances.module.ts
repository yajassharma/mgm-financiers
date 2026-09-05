import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Grievance, GrievanceSchema } from './schema/grievances.schema';
import { GrievancesService } from './grievances.service';
import { GrievancesController } from './grievances.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Grievance.name, schema: GrievanceSchema }]),
    NotificationsModule,
  ],
  controllers: [GrievancesController],
  providers: [GrievancesService],
})
export class GrievancesModule {}
