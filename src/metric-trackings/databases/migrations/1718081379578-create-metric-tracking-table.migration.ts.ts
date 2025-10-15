import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateMetricTrackingTable1718081379578
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'metric-trackings',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          }),
          new TableColumn({ name: 'date', type: 'timestamp' }),
          new TableColumn({ name: 'value', type: 'decimal' }),
          new TableColumn({ name: 'metricId', type: 'uuid' }),
          new TableColumn({
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          }),
          new TableColumn({
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          }),
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'metric-trackings',
      new TableForeignKey({
        columnNames: ['metricId'],
        referencedTableName: 'metrics',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('metric-trackings');
  }
}
