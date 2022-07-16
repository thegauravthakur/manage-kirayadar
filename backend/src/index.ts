import express from 'express';
import CookieParser from 'cookie-parser';
import Cors from 'cors';
import { createHttpsServer, createHttpServer } from './utils/server';
import routes from './routes';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(CookieParser());

// todo: update the frontend uri, once ready
app.use(Cors({ origin: 'http://localhost:3000' }));

const httpsServer = createHttpsServer(app);
const httpServer = createHttpServer(app);

const port = process.env.PORT || 8080;

app.use(routes);

httpsServer.listen(port, () => {
    console.log(`secure server started at port ${port}`);
});

httpServer.listen(4242, () => {
    console.log(`unsecure server started at port 4242`);
});
