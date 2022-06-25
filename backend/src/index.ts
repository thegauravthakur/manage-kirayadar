import express from 'express';
import CookieParser from 'cookie-parser';
import { createHttpsServer, createHttpServer } from './utils/server';
import routes from './routes';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(CookieParser());

app.use((req, res, next) => {
    console.log(`Request: ${req.url}`);
    next();
});

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