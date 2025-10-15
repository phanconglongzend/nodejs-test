import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetricEntity } from '../../entities/metric.entity';
import { MetricService } from '../../services/metric.service';
import { GetMetricByFilterDto } from '../dto/get-metric-by-filter.dto';

@Controller('metrics')
@ApiTags('Metrics')
export class MetricController {
  constructor(private metricService: MetricService) {}

  @Get()
  @ApiResponse({ type: MetricEntity })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Get data metric by filters',
  })
  async getMetrics(
    @Query() dto: GetMetricByFilterDto,
  ): Promise<MetricEntity[]> {
    return this.metricService.getMetrics(dto);
  }
}
