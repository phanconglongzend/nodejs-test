import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from '../../core/repositories/base.repository';
import { DataSource } from 'typeorm';
import { MetricTrackingEntity } from '../entities/metric-tracking.entity';
import { GetMetricTrackingByFilterDto } from '../http/dto/get-metric-tracking-by-filter.dto';

@Injectable()
export class MetricTrackingRepository extends BaseRepository<MetricTrackingEntity> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(MetricTrackingEntity, dataSource.createEntityManager());
  }

  async getMetricTrackingByFilters(
    dto: GetMetricTrackingByFilterDto,
  ): Promise<MetricTrackingEntity[]> {

    const query = this.createQueryBuilder('metricTracking')
      .leftJoinAndSelect('metricTracking.metric', 'metric')
      .distinctOn(['metric.type', 'DATE(metricTracking.date)'])
      .orderBy('metric.type')
      .addOrderBy('DATE(metricTracking.date)')
      .addOrderBy('metricTracking.createdAt', 'DESC')

    if (dto.type) {
      query.andWhere('metric.type = :type', { type: dto.type });
    }

    if (dto.fromDate) {
      query.andWhere('metricTracking.date >= :from', {
        from: new Date(dto.fromDate * 1000),
      });
    }

    if (dto.toDate) {
      query.andWhere('metricTracking.date <= :to', {
        to: new Date(dto.toDate * 1000),
      });
    }

    return query.getMany();
  }
}
