import { DataSource, DataSourceOptions } from "typeorm";


export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    synchronize: true,
    entities: ['dist/**/*.entity.{ts,js}'],
    migrations: ['dist/src/database/migrations/*.{ts,js}'],
  }

  const dataSource = new DataSource(dataSourceOptions);

  export default dataSource;
