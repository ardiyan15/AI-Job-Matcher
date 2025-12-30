import 'dotenv/config'
import { DataSource } from 'typeorm'
import { User } from '../user/user.entity'
import { SeederOptions } from 'typeorm-extension'

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_HOST ?? 3306),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: false,

    seeds: ['dist/database/seeds/*.js'],
} as unknown as (import('typeorm').DataSourceOptions & SeederOptions))