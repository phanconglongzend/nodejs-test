import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { MetricTypeEnum } from '../../enums/metric-type.enum';

export class GetMetricByFilterDto {
  @ApiProperty({
    enum: MetricTypeEnum,
    example: MetricTypeEnum.DISTANCE,
    required: false,
  })
  @IsOptional()
  @IsEnum(MetricTypeEnum)
  type?: MetricTypeEnum;
}
