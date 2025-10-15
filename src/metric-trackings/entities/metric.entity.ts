import { BaseModel } from '../../core/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { NumberTransformer } from '../databases/transformers/number.transformer';
import { MetricTrackingEntity } from './metric-tracking.entity';

@Entity('metrics')
export class MetricEntity extends BaseModel {
  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'decimal', transformer: new NumberTransformer() })
  conversionFactor: number;

  @Column({ type: 'decimal', transformer: new NumberTransformer() })
  conversionOffset: number;

  @OneToMany(
    () => MetricTrackingEntity,
    (metricTracking) => metricTracking.metric,
  )
  metricTrackings?: MetricTrackingEntity[];
}
