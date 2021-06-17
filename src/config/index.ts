import * as dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (dotenv.config({ path: `${__dirname}/${process.env.NODE_ENV}.env` }).error) {
    throw new Error(`Couldn't find file: ${__dirname}/${process.env.NODE_ENV}.env`);
}

export const env = {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',

    isCluster: process.env.PM2_MODE === 'cluster',

    /**
     * HTTP Proxy Server port
     */
    port: Number(process.env.PORT) || 3000,
    jwtSecret: process.env.JWT_SECRET || 'secret',

    /**
     * Database
     */
    database: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 3010,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
        synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
        logging: process.env.TYPEORM_LOGGING === 'true',
    },

    prefix: process.env.PREFIX || '',
};
