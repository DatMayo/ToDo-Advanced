import { Connection, getConnection, Repository } from 'typeorm';
import { DBToDo, DBUser } from '../databse/entity';
import { IResponse } from '../interfaces';

export class Todo {
    private _connection: Connection;
    private _repository_todo: Repository<DBToDo>;

    /**
     * Creates a new todo instance to use create, list, ...
     */
    constructor() {
        this._connection = getConnection('todo');
        this._repository_todo = this._connection.getRepository(DBToDo);
    }

    /**
     * Creates a new todo entry
     * @param {number} terminalId
     * @param {string} branch
     * @param {string} address
     * @param {number} zip
     * @param {string} town
     * @param {string} image
     * @returns Promise<IResponse> Returns status and further information, once the promise is resolved
     */
    async create(
        terminalId: number,
        branch: string,
        address: string,
        zip: number,
        town: string,
        image: string,
        createdBy: DBUser,
    ): Promise<IResponse> {
        const item: DBToDo = new DBToDo();
        item.terminalId = terminalId;
        item.branch = branch;
        item.address = address;
        item.zip = zip;
        item.town = town;
        item.image = image;
        item.createdBy = createdBy;
        const result = await this._repository_todo.save(item);
        if (!result)
            return {
                Code: 500,
                Error: [
                    {
                        msg: 'Todo could not be saved',
                    },
                ],
            };
        return {
            Code: 200,
            Data: {
                ToDos: [item],
            },
        };
    }

    /**
     * Shows a list of all open todo's
     * @param {DBToDo} showFinished Trigger or even show finished todos
     * @returns Promise<IResponse> Returns status and further information, once the promise is resolved
     */
    async getList(showFinished = false): Promise<IResponse> {
        let list: DBToDo[];
        if (showFinished)
            list = await this._repository_todo.find({
                order: {
                    isFinished: 'ASC',
                    id: 'DESC',
                },
            });
        else
            list = await this._repository_todo.find({
                where: {
                    isFinished: false,
                },
                order: {
                    id: 'DESC',
                },
            });
        return {
            Code: 200,
            Data: {
                ToDos: list,
            },
        };
    }

    /**
     * Search for a given todo item
     * @param {number} todoId Id of the searched item
     * @returns Promise<IResponse> Returns status and further information, once the promise is resolved
     */
    async getTodoById(todoId: number): Promise<IResponse> {
        const todo = await this._repository_todo.findOne({
            where: {
                id: todoId,
            },
        });
        if (!todo)
            return {
                Code: 404,
                Error: [{ msg: 'There is no todo with the given id' }],
            };
        return {
            Code: 200,
            Data: { ToDo: todo },
        };
    }

    /**
     * Toggles the isFinished status of the given id
     * @param {number} todoId todoId
     * @param {DBToDo} todo Item to toggle
     * @returns Promise<IResponse> Returns status and further information, once the promise is resolved
     */
    async toggleStatus(todoId: number, todo: DBToDo): Promise<IResponse> {
        todo.isFinished = !todo.isFinished;

        const updatedTodo = await this._repository_todo.save(todo);
        if (!updatedTodo)
            return {
                Code: 500,
                Error: [{ msg: 'The given entry could not be updated' }],
            };
        return {
            Code: 200,
            Success: {
                msg: 'The given entry was updated successful',
            },
            Data: {
                Todo: todo,
            },
        };
    }
}
