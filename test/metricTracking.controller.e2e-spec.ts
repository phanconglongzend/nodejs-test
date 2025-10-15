import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('MetricTrackingController (e2e)', () => {
  let app: INestApplication;
  let testMetricId: string;
  let distanceMetricId: string;
  let temperatureMetricId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Get metric IDs for testing
    const metricsResponse = await request(app.getHttpServer()).get('/metrics');
    const distanceMetric = metricsResponse.body.find(
      (m) => m.type === 'DISTANCE',
    );
    const temperatureMetric = metricsResponse.body.find(
      (m) => m.type === 'TEMPERATURE',
    );

    testMetricId = metricsResponse.body[0].id;
    distanceMetricId = distanceMetric?.id;
    temperatureMetricId = temperatureMetric?.id;
  });

  describe('POST /metric-trackings', () => {
    describe('when creating metric tracking with valid data', () => {
      it('should create metric tracking successfully', async () => {
        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            metricId: testMetricId,
            date: 1716930565,
            value: 100,
          })
          .expect(204);
      });

      it('should create multiple metric trackings for the same metric', async () => {
        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            metricId: testMetricId,
            date: 1716930566,
            value: 150,
          })
          .expect(204);

        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            metricId: testMetricId,
            date: 1716930567,
            value: 200,
          })
          .expect(204);
      });

      it('should create metric tracking with decimal values', async () => {
        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            metricId: testMetricId,
            date: 1716930568,
            value: 98.6,
          })
          .expect(204);
      });
    });

    describe('when creating metric tracking with invalid data', () => {
      it('should return 400 for missing metricId', async () => {
        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            date: 1716930565,
            value: 100,
          })
          .expect(400);
      });

      it('should return 400 for invalid metricId format', async () => {
        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            metricId: 'invalid-uuid',
            date: 1716930565,
            value: 100,
          })
          .expect(400);
      });

      it('should return 400 for missing date', async () => {
        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            metricId: testMetricId,
            value: 100,
          })
          .expect(400);
      });

      it('should return 400 for missing value', async () => {
        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            metricId: testMetricId,
            date: 1716930565,
          })
          .expect(400);
      });

      it('should return 400 for invalid date type', async () => {
        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            metricId: testMetricId,
            date: 'invalid-date',
            value: 100,
          })
          .expect(400);
      });

      it('should return 400 for invalid value type', async () => {
        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            metricId: testMetricId,
            date: 1716930565,
            value: 'not-a-number',
          })
          .expect(400);
      });
    });
  });

  describe('GET /metric-trackings', () => {
    beforeAll(async () => {
      // Create some test data
      await request(app.getHttpServer()).post('/metric-trackings').send({
        metricId: distanceMetricId,
        date: 1716930500,
        value: 1000,
      });

      await request(app.getHttpServer()).post('/metric-trackings').send({
        metricId: temperatureMetricId,
        date: 1716930600,
        value: 25,
      });

      await request(app.getHttpServer()).post('/metric-trackings').send({
        metricId: temperatureMetricId,
        date: 1716930700,
        value: 30,
      });
    });

    describe('when getting all metric trackings without filters', () => {
      it('should return all metric trackings with correct structure', async () => {
        const response = await request(app.getHttpServer())
          .get('/metric-trackings')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);

        // Validate structure of first metric tracking
        const tracking = response.body[0];
        expect(tracking).toHaveProperty('id');
        expect(tracking).toHaveProperty('value');
        expect(tracking).toHaveProperty('date');
        expect(tracking).toHaveProperty('metricId');
        expect(tracking).toHaveProperty('metric');
        expect(tracking.metric).toHaveProperty('name');
        expect(tracking.metric).toHaveProperty('type');
      });
    });

    describe('when filtering metric trackings by type', () => {
      it('should return only DISTANCE type metric trackings', async () => {
        const response = await request(app.getHttpServer())
          .get('/metric-trackings?type=DISTANCE')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach((tracking) => {
          expect(tracking.metric.type).toBe('DISTANCE');
        });
      });

      it('should return only TEMPERATURE type metric trackings', async () => {
        const response = await request(app.getHttpServer())
          .get('/metric-trackings?type=TEMPERATURE')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach((tracking) => {
          expect(tracking.metric.type).toBe('TEMPERATURE');
        });
      });

      it('should return 400 for invalid type', async () => {
        await request(app.getHttpServer())
          .get('/metric-trackings?type=INVALID_TYPE')
          .expect(400);
      });
    });

    describe('when filtering metric trackings by date range', () => {
      it('should return metric trackings from a specific date', async () => {
        const response = await request(app.getHttpServer())
          .get('/metric-trackings?fromDate=1716930600')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);

        response.body.forEach((tracking) => {
          const trackingDate = new Date(tracking.date).getTime() / 1000;
          expect(trackingDate).toBeGreaterThanOrEqual(1716930600);
        });
      });

      it('should return metric trackings up to a specific date', async () => {
        const response = await request(app.getHttpServer())
          .get('/metric-trackings?toDate=1716930600')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);

        response.body.forEach((tracking) => {
          const trackingDate = new Date(tracking.date).getTime() / 1000;
          expect(trackingDate).toBeLessThanOrEqual(1716930600);
        });
      });

      it('should return metric trackings within a date range', async () => {
        const response = await request(app.getHttpServer())
          .get('/metric-trackings?fromDate=1716930500&toDate=1716930700')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);

        response.body.forEach((tracking) => {
          const trackingDate = new Date(tracking.date).getTime() / 1000;
          expect(trackingDate).toBeGreaterThanOrEqual(1716930500);
          expect(trackingDate).toBeLessThanOrEqual(1716930700);
        });
      });
    });

    describe('when filtering with combined filters', () => {
      it('should filter by type and date range together', async () => {
        const response = await request(app.getHttpServer())
          .get(
            '/metric-trackings?type=TEMPERATURE&fromDate=1716930600&toDate=1716930700',
          )
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);

        response.body.forEach((tracking) => {
          expect(tracking.metric.type).toBe('TEMPERATURE');
          const trackingDate = new Date(tracking.date).getTime() / 1000;
          expect(trackingDate).toBeGreaterThanOrEqual(1716930600);
          expect(trackingDate).toBeLessThanOrEqual(1716930700);
        });
      });
    });

    describe('when testing metric conversion', () => {
      it('should not convert metrics of different types', async () => {
        // Get a DISTANCE metric
        const distanceMetrics = await request(app.getHttpServer()).get(
          '/metrics?type=DISTANCE',
        );
        const distanceMetric = distanceMetrics.body[0];

        // Get a TEMPERATURE metric
        const temperatureMetrics = await request(app.getHttpServer()).get(
          '/metrics?type=TEMPERATURE',
        );
        const temperatureMetric = temperatureMetrics.body[0];

        // Create a tracking with DISTANCE metric
        await request(app.getHttpServer())
          .post('/metric-trackings')
          .send({
            metricId: distanceMetric.id,
            date: 1716930900,
            value: 500,
          })
          .expect(204);

        // Try to convert to TEMPERATURE metric (should not convert)
        const response = await request(app.getHttpServer())
          .get(`/metric-trackings?convertMetricId=${temperatureMetric.id}`)
          .expect(200);

        // Find the tracking we just created
        const tracking = response.body.find(
          (t) =>
            t.metricId === distanceMetric.id &&
            new Date(t.date).getTime() === 1716930900000,
        );

        expect(tracking).toBeDefined();

        // The metric should NOT be converted (should still be DISTANCE)
        expect(tracking.metric.id).toBe(distanceMetric.id);
        expect(tracking.metric.type).toBe('DISTANCE');
        expect(tracking.value).toBe(500); // Value unchanged
      });
    });

    describe('when validating response data types', () => {
      it('should return metric trackings with correct data types', async () => {
        const response = await request(app.getHttpServer())
          .get('/metric-trackings')
          .expect(200);

        expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach((tracking) => {
          expect(typeof tracking.id).toBe('string');
          expect(typeof tracking.value).toBe('number');
          expect(typeof tracking.date).toBe('string');
          expect(typeof tracking.metricId).toBe('string');
          expect(typeof tracking.metric).toBe('object');
          expect(typeof tracking.metric.name).toBe('string');
          expect(typeof tracking.metric.type).toBe('string');
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
