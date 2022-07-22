import express from 'express';
import CookieParser from 'cookie-parser';
import Cors from 'cors';
import { createHttpServer } from './utils/server';
import routes from './routes';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(CookieParser());

// todo: update the frontend uri, once ready
app.use(Cors({ origin: 'http://localhost:3000' }));

const httpServer = createHttpServer(app);

const port = process.env.PORT || 4242;

app.use(routes);

// httpsServer.listen(port, () => {
//     console.log(`secure server started at port ${port}`);
// });

httpServer.listen(port, () => {
    console.log(`unsecure server started at port 4242`);
});
