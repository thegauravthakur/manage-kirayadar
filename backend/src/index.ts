import express from 'express';
import CookieParser from 'cookie-parser';
import Cors from 'cors';
import { createHttpServer } from './utils/server';
import routes from './routes';
import 'dotenv/config';
import { corsOptions } from './utils/shared';
import * as Sentry from '@sentry/node';
import { initializeSentry } from './utils/sentryHelper';

const app = express();
const port = process.env.PORT || 4242;
const httpServer = createHttpServer(app);

app.use(express.json());
app.use(CookieParser());

app.use(Cors(corsOptions));
initializeSentry(app);

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(routes);
app.use(Sentry.Handlers.errorHandler());

httpServer.listen(port, () => {
    console.log(`server started at port: ${port}`);
});
