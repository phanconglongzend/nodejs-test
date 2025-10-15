import { Injectable } from '@nestjs/common';
import { MetricEntity } from '../entities/metric.entity';
import { BaseRepository } from '../../core/repositories/base.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MetricRepository extends BaseRepository<MetricEntity> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(MetricEntity, dataSource.createEntityManager());
  }
}
