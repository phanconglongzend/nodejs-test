import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMetricTrackingDto {
  @ApiProperty({
    description: 'metric id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID('4')
  metricId: string;

  @ApiProperty({
    description: 'The date of the user convert date to timestamp',
    example: '1716930565',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  date: number;

  @ApiProperty({
    description: 'The value of tracking',
    example: 100,
    required: true,
  })
  @IsNumber()
  value: number;
}
