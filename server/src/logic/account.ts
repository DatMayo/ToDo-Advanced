import { compareSync, hashSync } from 'bcryptjs';
import { Connection, getConnection, Repository } from 'typeorm';
import { DBUser } from '../databse/entity';
import { IResponse } from '../interfaces';
import { Token } from './token';

export class Account {
    private _connection: Connection;
    private _repositoryUser: Repository<DBUser>;

    /**
     * Creates a new account instance to use login, register and more
     */
    constructor() {
        this._connection = getConnection('todo');
        this._repositoryUser = this._connection.getRepository(DBUser);
    }

    /**
     * Compared two passwords against each other
     * @param password1 Plain-Text source password
     * @param password2 Plain-Text or hashed password
     * @private
     */
    private comparePasswords(password1: string, password2: string, isHashed = true): boolean {
        // const isHashed = password2.match(/(\$[0-9A-Za-z]{2})(\$[0-9]{2}\$)/gi) == null;
        if (isHashed) {
            return compareSync(password1, password2);
        } else {
            return password1 === password2;
        }
    }

    /**
     * Starts login process
     * @param {string} username Username used for login
     * @param {string} password Plain text password to check against database
     * @returns Promise<IResponse> Returns status and further information, once the promise is resolved
     */
    async login(username: string, password: string): Promise<IResponse> {
        const data = await this._repositoryUser.findOne({
            select: ['id', 'username', 'password', 'locked'],
            where: {
                username,
            },
        });
        if (!data)
            return {
                Code: 403,
                Error: [
                    {
                        msg: 'The given username does not exist',
                    },
                ],
            };
        const passwordMatch = this.comparePasswords(password, data.password as string);
        if (!passwordMatch)
            return {
                Code: 403,
                Error: [
                    {
                        msg: 'The given password is not correct',
                    },
                ],
            };
        if (data.locked)
            return {
                Code: 403,
                Error: [
                    {
                        msg: 'The given account is locked',
                    },
                ],
            };
        let token = Token.getInstance();
        const tokenData = await token.create(data);

        if (!tokenData)
            return {
                Code: 500,
                Error: [
                    {
                        msg: 'Could not create a security token, please try again later',
                    },
                ],
            };
        return {
            Code: 200,
            Data: {
                id: data.id,
                tokenId: tokenData.token,
            },
        };
    }

    /**
     * Creates an account for the given user
     * @param {string} username Username to create
     * @param {string} password Password for the given username
     */
    async register(username: string, password: string): Promise<IResponse> {
        const data = await this._repositoryUser.findOne({
            select: ['id'],
            where: {
                username,
            },
        });
        if (data)
            return {
                Code: 400,
                Error: [
                    {
                        msg: 'The given username already exists',
                    },
                ],
            };
        const encodedPassword = hashSync(password);
        const userAccount: DBUser = new DBUser();
        userAccount.username = username;
        userAccount.password = encodedPassword;
        const databaseResult = await this._repositoryUser.save(userAccount);
        if (!databaseResult)
            return {
                Code: 500,
                Error: [
                    {
                        msg: 'User could not be created, please try again later',
                    },
                ],
            };
        return {
            Code: 200,
            Success: {
                msg: 'Account created successful',
            },
        };
    }
}
