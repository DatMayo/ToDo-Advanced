import { Request, Response, Router } from 'express';
import { header, validationResult } from 'express-validator';
import { IResponse } from '../../../interfaces';
import { logger } from '../../../logger';
import { Todo, Token } from '../../../logic';

const router: Router = Router();

router.get(
    '/list/:showfinished?',
    [header('token').not().isEmpty().withMessage('Request is missing a token')],
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
            const result = await todoHandle.getList(req.params.showfinished !== undefined);
            return res.status(result.Code).send(result);
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

export const ToDoList: Router = router;
