import cors from 'cors';
import express from 'express';
import { logger } from '../logger';
import { IError, IResponse } from '../interfaces';
import { AccountLogin, AccountRegistration } from './routes/account';
import bodyParser from 'body-parser';
import { ToDoCreate, ToDoList, ToDoToggle } from './routes/todo';

const PORT: number = parseInt(process.env.PORT!) || 8181;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Log all incoming requests
app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info(`[${req.method} - ${req.ip}] ${req.originalUrl}`);
    next();
});

app.use('/account', [AccountLogin, AccountRegistration]);
app.use('/todo', [ToDoCreate, ToDoList, ToDoToggle]);

// Handle all 404 routes
app.all('*', (req: express.Request, res: express.Response) => {
    logger.info(`Access to non handled url: ${req.originalUrl}`);
    const errorObject: IError[] = [];

    errorObject.push({ msg: 'The given resource could not be found' });

    const responseObject: IResponse = {
        Code: 404,
        Error: errorObject,
    };
    return res.status(404).send(responseObject);
});

// Start listening
app.listen(PORT, () => {
    logger.info(`Server up and listening on port ${PORT}`);
});
