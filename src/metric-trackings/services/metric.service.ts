import { Injectable } from '@nestjs/common';
import { MetricEntity } from '../entities/metric.entity';
import { GetMetricByFilterDto } from '../http/dto/get-metric-by-filter.dto';
import { MetricRepository } from '../repositories/metric.repositories';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class MetricService {
  constructor(private metricsRepository: MetricRepository) {}

  async getMetrics(dto: GetMetricByFilterDto): Promise<MetricEntity[]> {
    const conditions: FindOptionsWhere<MetricEntity> = {};
    if (dto.type) {
      conditions.type = dto.type;
    }
    return this.metricsRepository.findBy(conditions);
  }
}
