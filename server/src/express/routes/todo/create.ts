import { Request, Response, Router } from 'express';
import { body, header, validationResult } from 'express-validator';
import { IResponse } from '../../../interfaces';
import { logger } from '../../../logger';
import { Todo, Token } from '../../../logic';
import { DBUser } from '../../../databse/entity';
const router: Router = Router();

router.post(
    '/create',
    [
        header('token').not().isEmpty().withMessage('Request is missing a token'),
        body('terminalId').not().isEmpty().withMessage('Missing TerminalID'),
        body('branch').not().isEmpty().withMessage('Missing branch'),
        body('address').not().isEmpty().withMessage('Missing address'),
        body('zip')
            .not()
            .isEmpty()
            .withMessage('Missing ZIP Code')
            .isLength({ max: 5, min: 5 })
            .withMessage('ZIP Code must be 5 digits'),
        body('town').not().isEmpty().withMessage('Missing Town'),
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
            const todoCreate = await todoHandle.create(
                req.body.terminalId,
                req.body.branch,
                req.body.address,
                req.body.zip,
                req.body.town,
                req.body.image ? req.body.image : '',
                tokenResponse.Data!.User! as DBUser,
            );
            return res.status(todoCreate.Code).send(todoCreate);
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

export const ToDoCreate: Router = router;
