import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateMetricTable1718081364475 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'metrics',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          }),
          new TableColumn({ name: 'type', type: 'character varying' }),
          new TableColumn({ name: 'name', type: 'character varying' }),
          new TableColumn({ name: 'conversionFactor', type: 'decimal' }),
          new TableColumn({ name: 'conversionOffset', type: 'decimal' }),
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('metrics');
  }
}
