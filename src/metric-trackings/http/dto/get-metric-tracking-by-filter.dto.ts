import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetricTypeEnum } from '../../enums/metric-type.enum';
import { Transform } from 'class-transformer';

export class GetMetricTrackingByFilterDto {
  @ApiProperty({
    enum: MetricTypeEnum,
    example: MetricTypeEnum.DISTANCE,
    required: false,
  })
  @IsOptional()
  @IsEnum(MetricTypeEnum)
  type?: MetricTypeEnum;

  @ApiProperty({
    description: 'The to date of the user convert date to timestamp',
    example: '1716930500',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  toDate?: number;

  @ApiProperty({
    description: 'The from date of the user convert date to timestamp',
    example: '1716930565',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  fromDate?: number;

  @ApiProperty({
    description: 'metric id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  convertMetricId?: string;
}
