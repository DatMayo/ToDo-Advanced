import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { IResponse } from '../../../interfaces';
import { logger } from '../../../logger';
import { Account } from '../../../logic';

const router: Router = Router();
router.post(
    '/register',
    [
        body('username')
            .not()
            .isEmpty()
            .withMessage("The given username can't be empty")
            .isLength({ min: 4 })
            .withMessage('The username needs at least 4 characters long'),
        body('password')
            .not()
            .isEmpty()
            .withMessage("The given password can't be empty")
            .isLength({ min: 8 })
            .withMessage('The password needs to be at least 8 characters long'),
        body('passwordConfirm')
            .not()
            .isEmpty()
            .withMessage("The password confirmation can't be emptry")
            .isLength({ min: 8 })
            .withMessage('The password confirmation needs to be at least 8 characters long')

            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    // trow error if passwords do not match
                    throw new Error("The given passwords don't match");
                } else {
                    return value;
                }
            }),
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
            const accountHandle = new Account();
            const result = await accountHandle.register(req.body.username, req.body.password);
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

export const AccountRegistration: Router = router;
