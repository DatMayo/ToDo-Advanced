import { ConnectionOptions, createConnection } from 'typeorm';
import { DBToDo, DBToken, DBUser } from './entity';
import { logger, TypeOrmLogger } from '../logger';

const connectionString: ConnectionOptions = {
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT!) || 3306,
    username: process.env.MYSQL_USER || 'todo',
    password: process.env.MYSQL_PASS || 'todo',
    database: process.env.MYSQL_DB || 'todo',
    entities: [DBToDo, DBToken, DBUser],
    name: 'todo',
    logging: true,
    logger: new TypeOrmLogger(),
    synchronize: true,
};

async function connectToDatabase(): Promise<void> {
    createConnection(connectionString)
        .then(() => {
            logger.info('Successfully connected to our database');
        })
        .catch((error: any) => {
            logger.warn(error.message);
            setTimeout(() => connectToDatabase(), 10000);
        });
}

connectToDatabase().then(() => {});
