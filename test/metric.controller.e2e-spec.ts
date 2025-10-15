import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('MetricController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('GET /metrics', () => {
    describe('when getting all metrics without filters', () => {
      it('should return all metrics with correct structure', async () => {
        const response = await request(app.getHttpServer())
          .get('/metrics')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);

        // Validate structure of first metric
        const metric = response.body[0];
        expect(metric).toHaveProperty('id');
        expect(metric).toHaveProperty('name');
        expect(metric).toHaveProperty('type');
        expect(metric).toHaveProperty('conversionFactor');
        expect(metric).toHaveProperty('conversionOffset');
        expect(metric).toHaveProperty('createdAt');
        expect(metric).toHaveProperty('updatedAt');
      });

      it('should return metrics with expected initial data', async () => {
        const response = await request(app.getHttpServer())
          .get('/metrics')
          .expect(200);

        // Check that we have metrics for both types
        const distanceMetrics = response.body.filter(
          (m) => m.type === 'DISTANCE',
        );
        const temperatureMetrics = response.body.filter(
          (m) => m.type === 'TEMPERATURE',
        );

        expect(distanceMetrics.length).toBeGreaterThan(0);
        expect(temperatureMetrics.length).toBeGreaterThan(0);
      });
    });

    describe('when filtering metrics by type', () => {
      it('should return only DISTANCE type metrics', async () => {
        const response = await request(app.getHttpServer())
          .get('/metrics?type=DISTANCE')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);

        // All metrics should be DISTANCE type
        response.body.forEach((metric) => {
          expect(metric.type).toBe('DISTANCE');
        });
      });

      it('should return only TEMPERATURE type metrics', async () => {
        const response = await request(app.getHttpServer())
          .get('/metrics?type=TEMPERATURE')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);

        // All metrics should be TEMPERATURE type
        response.body.forEach((metric) => {
          expect(metric.type).toBe('TEMPERATURE');
        });
      });

      it('should return 400 for invalid metric type', async () => {
        await request(app.getHttpServer())
          .get('/metrics?type=INVALID_TYPE')
          .expect(400);
      });
    });

    describe('when checking specific metric properties', () => {
      it('should have correct conversion factors', async () => {
        const response = await request(app.getHttpServer())
          .get('/metrics')
          .expect(200);

        response.body.forEach((metric) => {
          expect(typeof metric.conversionFactor).toBe('number');
          expect(typeof metric.conversionOffset).toBe('number');
        });
      });

      it('should have valid UUIDs for metric IDs', async () => {
        const response = await request(app.getHttpServer())
          .get('/metrics')
          .expect(200);

        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        response.body.forEach((metric) => {
          expect(metric.id).toMatch(uuidRegex);
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
