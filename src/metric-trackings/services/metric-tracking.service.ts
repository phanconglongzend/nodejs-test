import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { MetricTrackingEntity } from '../entities/metric-tracking.entity';
import { CreateMetricTrackingDto } from '../http/dto/create-metric-tracking.dto';
import { GetMetricTrackingByFilterDto } from '../http/dto/get-metric-tracking-by-filter.dto';
import { MetricTrackingRepository } from '../repositories/metric-tracking.repositories';
import { MetricRepository } from '../repositories/metric.repositories';

@Injectable()
export class MetricTrackingService {
  constructor(
    private metricTrackingRepository: MetricTrackingRepository,
    private metricRepository: MetricRepository,
  ) {}

  async createMetricTracking(dto: CreateMetricTrackingDto): Promise<void> {
    const { metricId, date, value } = dto;
    await this.metricTrackingRepository.insert({
      metricId,
      date: new Date(date * 1000),
      value,
    });
  }

  async getMetricTrackingByFilter(
    dto: GetMetricTrackingByFilterDto,
  ): Promise<MetricTrackingEntity[]> {
    const metricTrackings =
      await this.metricTrackingRepository.getMetricTrackingByFilters(dto);

    if (dto.convertMetricId) {
      const convertMetric = await this.metricRepository.findOneBy({
        id: dto.convertMetricId,
      });
      for (const metricTracking of metricTrackings) {
        metricTracking.convert(convertMetric);
      }
    }

    return metricTrackings;
  }
}
