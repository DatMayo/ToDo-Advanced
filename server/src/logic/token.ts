import { Connection, getConnection, Repository } from 'typeorm';
import { DBToken, DBUser } from '../databse/entity';
import { IResponse } from '../interfaces';
import { logger } from '../logger';

export class Token {
    static _token: Token;
    private _connection: Connection;
    private _repository_token: Repository<DBToken>;

    private constructor() {
        this._connection = getConnection('todo');
        this._repository_token = this._connection.getRepository(DBToken);
        setInterval(this.checkExpiredToken, 5000, this._repository_token);
    }

    static getInstance(): Token {
        return this._token || (this._token = new this());
    }

    private async checkExpiredToken(repo_token: Repository<DBToken>): Promise<void> {
        logger.debug('Checking for expired token');
        const expiredDateTime = new Date(Date.now());
        expiredDateTime.setMinutes(expiredDateTime.getMinutes() - 15);
        const expiredToken = await repo_token
            .createQueryBuilder()
            .where('updatedAt < :updated', {
                updated: expiredDateTime.getTime() / 1000,
            })
            .getMany();
        logger.debug(`Found ${expiredToken.length} expired token`);
        expiredToken.forEach((item: DBToken) => {
            logger.debug(`Deleting expired token for user ${item.user.username}`);
            repo_token.delete(item);
        });
    }

    /**
     * Crates or updates a token for the given user
     * @param  {DBUser} user User DB Handle
     * @returns Promise<string> Token for further validation
     */
    async create(user: DBUser): Promise<DBToken> {
        const token = await this._repository_token.findOne({ user: user });
        if (token) {
            await this._repository_token.update(token.id, { updatedAt: new Date().toISOString() });
            return token;
        }

        const currentToken = Math.random().toString(36).substring(7);
        let rawTokenData: DBToken = new DBToken();
        rawTokenData.token = currentToken;
        rawTokenData.user = user;
        return await this._repository_token.save(rawTokenData);
    }

    /**
     * Checks if a token is valid
     * @param  {string} user_token Token to check
     * @returns Promise<IResponse> Returns response in a IResponse format
     */
    async isTokenValid(user_token: string): Promise<IResponse> {
        if (!user_token)
            return {
                Code: 400,
                Error: [
                    {
                        msg: 'Missing token',
                    },
                ],
            };
        const data = await this._repository_token.findOne({
            where: { token: user_token },
            relations: ['user'],
        });

        if (!data)
            return {
                Code: 403,
                Error: [
                    {
                        msg: 'The given token is not correct',
                    },
                ],
            };
        data.updatedAt = new Date(Date.now());
        const tokenUpdated = await this._repository_token.save(data);
        if (!tokenUpdated)
            return {
                Code: 500,
                Error: [
                    {
                        msg: 'Could not update token due an internal error',
                    },
                ],
            };
        return {
            Code: 200,
            Success: {
                msg: 'The given token is valid',
            },
            Data: {
                User: data.user,
            },
        };
    }
}
