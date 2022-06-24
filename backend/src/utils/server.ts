import { Express } from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';

export function createHttpsServer(app: Express) {
    const privateKey = fs.readFileSync('localhost-key.pem', 'utf8');
    const certificate = fs.readFileSync('localhost.pem', 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    return https.createServer(credentials, app);
}

export function createHttpServer(app: Express) {
    return http.createServer(app);
}
