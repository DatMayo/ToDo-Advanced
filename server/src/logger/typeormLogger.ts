import { Logger, QueryRunner } from 'typeorm';
import { logger } from './index';

export class TypeOrmLogger implements Logger {
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        logger.log(level, message);
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        logger.debug(message);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        logger.debug(query);
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        logger.debug(query);
        logger.error(error);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        logger.debug(`[${time}] ${query}`);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        logger.debug(message);
    }
}
