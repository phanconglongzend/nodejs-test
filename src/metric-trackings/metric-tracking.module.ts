import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricTrackingEntity } from './entities/metric-tracking.entity';
import { MetricEntity } from './entities/metric.entity';
import { MetricTrackingController } from './http/controllers/metric-tracking.controller';
import { MetricController } from './http/controllers/metric.controller';
import { MetricTrackingRepository } from './repositories/metric-tracking.repositories';
import { MetricRepository } from './repositories/metric.repositories';
import { MetricTrackingService } from './services/metric-tracking.service';
import { MetricService } from './services/metric.service';

@Module({
  providers: [
    MetricService,
    MetricTrackingService,
    MetricRepository,
    MetricTrackingRepository,
  ],
  controllers: [MetricController, MetricTrackingController],
  exports: [],
  imports: [TypeOrmModule.forFeature([MetricEntity, MetricTrackingEntity])],
})
export class MetricTrackingModule {}
