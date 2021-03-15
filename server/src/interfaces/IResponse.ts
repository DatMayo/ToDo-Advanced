import { IError, ISuccess } from './index';
import { DBToDo } from '../databse/entity';

export interface IResponse {
    Code: number;
    Error?: IError[];
    Success?: ISuccess;
    Data?: {
        ToDo?: DBToDo;
        ToDos?: DBToDo[];
        [propName: string]: unknown;
    };
}
