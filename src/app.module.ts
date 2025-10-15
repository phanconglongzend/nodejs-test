import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfig } from './configs/typeorm.config';
import { MetricTrackingModule } from './metric-trackings/metric-tracking.module';

@Module({
  imports: [TypeOrmConfig, MetricTrackingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
