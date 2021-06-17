import { Container } from 'typedi';
import {
    createConnection,
    ConnectionOptions,
    useContainer,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import { env } from './config';
import { validateOrReject } from 'class-validator';

/**
 * Before insert/update validation data
 */
export abstract class ValidationEntity extends BaseEntity {
    @BeforeInsert()
    @BeforeUpdate()
    async validate(): Promise<void> {
        await validateOrReject(this);
    }
}

/**
 * Create Database Connection
 */
export async function createDatabaseConnection(): Promise<void> {
    const opts: ConnectionOptions = {
        type: 'mssql',
        host: env.database.host,
        port: env.database.port,
        username: env.database.username,
        password: env.database.password,
        database: env.database.name,
        synchronize: env.database.synchronize,
        logging: env.database.logging,
        entities: [`${__dirname}/models/*{.ts,.js}`],
        //subscribers: [`${__dirname}/subscribers/*{.ts,.js}`],
        options: {
            encrypt: false,
            rowCollectionOnRequestCompletion: true,
            enableArithAbort: true,
        },
        requestTimeout: 5000,
    };
    useContainer(Container);
    await createConnection(opts);
}
