import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './env.config';

export const TypeOrmConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  synchronize: false,
  entities: [`dist/*/entities/*.js`],
  migrations: [`dist/*/databases/migrations/*.js`],
  migrationsRun: true,
  autoLoadEntities: true,
});
