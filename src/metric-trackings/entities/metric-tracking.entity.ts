import { BaseModel } from '../../core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { NumberTransformer } from '../databases/transformers/number.transformer';
import { MetricEntity } from './metric.entity';

@Entity('metric-trackings')
export class MetricTrackingEntity extends BaseModel {
  @Column({ type: 'decimal', transformer: new NumberTransformer() })
  value: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ nullable: true })
  metricId: string;

  @ManyToOne(() => MetricEntity, (metric) => metric.metricTrackings)
  @JoinColumn({ name: 'metricId' })
  metric: MetricEntity;

  convert(metric: MetricEntity): void {
    if (this.metric?.type !== metric.type) {
      return;
    }

    if (this.metric.conversionFactor === 0) {
      return;
    }

    const baseValue =
      (this.value - this.metric.conversionOffset) /
      this.metric.conversionFactor;

    this.value = baseValue * metric.conversionFactor + metric.conversionOffset;
    this.metric = metric;
  }
}
