import express from 'express';
import CookieParser from 'cookie-parser';
import Cors from 'cors';
import { createHttpServer } from './utils/server';
import routes from './routes';
import 'dotenv/config';
import { corsOptions } from './utils/shared';

const app = express();
app.use(express.json());
app.use(CookieParser());

app.use(Cors(corsOptions));

const httpServer = createHttpServer(app);

const port = process.env.PORT || 4242;

app.use(routes);

httpServer.listen(port, () => {
    console.log(`unsecure server started at port 4242`);
});
