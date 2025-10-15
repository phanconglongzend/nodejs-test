import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MetricTrackingEntity } from 'src/metric-trackings/entities/metric-tracking.entity';
import { MetricTrackingService } from '../../services/metric-tracking.service';
import { CreateMetricTrackingDto } from '../dto/create-metric-tracking.dto';
import { GetMetricTrackingByFilterDto } from '../dto/get-metric-tracking-by-filter.dto';

@Controller('metric-trackings')
@ApiTags('MetricTrackings')
export class MetricTrackingController {
  constructor(private metricTrackingService: MetricTrackingService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description: 'Create data metric tracking',
  })
  async createMetricTracking(
    @Body() dto: CreateMetricTrackingDto,
  ): Promise<void> {
    await this.metricTrackingService.createMetricTracking(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Get data metric tracking by filters',
  })
  async getMetricTrackingByFilter(
    @Query() dto: GetMetricTrackingByFilterDto,
  ): Promise<MetricTrackingEntity[]> {
    return this.metricTrackingService.getMetricTrackingByFilter(dto);
  }
}
