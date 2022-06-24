import express from 'express';
import { createHttpsServer, createHttpServer } from './utils/server';
import routes from './routes';

const app = express();
app.use(express.json());

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
