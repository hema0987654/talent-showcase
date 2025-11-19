import { registerAs } from '@nestjs/config';
export default registerAs('database', () => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'mydatabase',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    autoLoadEntities: true,
}));