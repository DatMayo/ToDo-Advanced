import { Request, Response, Router } from 'express';
import { header, param, validationResult } from 'express-validator';
import { IResponse } from '../../../interfaces';
import { logger } from '../../../logger';
import { Todo, Token } from '../../../logic';
import { DBToDo } from '../../../databse/entity';

const router: Router = Router();

router.put(
    '/toggle/:todoId?',
    [
        header('token').not().isEmpty().withMessage('Request is missing a token'),
        param('todoId').not().isEmpty().withMessage('Missing todoId'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        let responseObject: IResponse;
        if (!errors.isEmpty()) {
            responseObject = {
                Code: 400,
                Error: errors.array(),
            };
            logger.debug(responseObject);
            return res.status(responseObject.Code).send(responseObject);
        }
        try {
            const tokenHandle = Token.getInstance();
            const token = req.headers.token as string;
            let tokenResponse = await tokenHandle.isTokenValid(token);
            if (tokenResponse.Code !== 200) return res.status(tokenResponse.Code).send(tokenResponse);
            const todoHandle = new Todo();
            const result = await todoHandle.getTodoById(parseInt(req.params.todoId));
            if (result.Code !== 200) return res.status(result.Code).send(result);

            const todoId: number = parseInt(req.params.todoId);
            const todoResult = await todoHandle.toggleStatus(todoId, result.Data?.ToDo as DBToDo);
            return res.status(todoResult.Code).send(todoResult);
        } catch (err) {
            logger.error(err.message);
            responseObject = {
                Code: 500,
                Error: [
                    {
                        msg: err.message,
                    },
                ],
            };
            return res.status(responseObject.Code).send(responseObject);
        }
    },
);

export const ToDoToggle: Router = router;
