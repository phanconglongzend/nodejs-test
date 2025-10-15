import { MetricTypeEnum } from 'src/metric-trackings/enums/metric-type.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateDataMetricTable1718089248000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query =
      'INSERT INTO "metrics" ("name", "type", "conversionFactor", "conversionOffset") values ($1, $2, $3, $4)';
    const records = [
      ['meter', MetricTypeEnum.DISTANCE, 1.0, 0],
      ['centimeter', MetricTypeEnum.DISTANCE, 100, 0],
      ['inch', MetricTypeEnum.DISTANCE, 39.3700787, 0],
      ['feet', MetricTypeEnum.DISTANCE, 3.2808399, 0],
      ['yard', MetricTypeEnum.DISTANCE, 1.0936133, 0],

      ['°C', MetricTypeEnum.TEMPERATURE, 1.0, 0],
      ['°F', MetricTypeEnum.TEMPERATURE, 9 / 5, 32],
      ['°K', MetricTypeEnum.TEMPERATURE, 1.0, 273.15],
    ];

    for (const record of records) {
      await queryRunner.manager.query(query, record);
    }
  }

  public async down(): Promise<void> {}
}
