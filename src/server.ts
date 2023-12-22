import express, { Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { FileCachingService } from './services';
import path from 'path';
import checkCacheMiddleware from './middlewares/check-cache-middleware';
import saveCacheInterceptor from './interceptors/save-cache-interceptor';
import winston, { format, transports } from 'winston';

import {
    createProxyMiddleware,
    responseInterceptor,
} from 'http-proxy-middleware';

dotenv.config();

const port = process.env.PORT || 8000;

const targetProtocol = process.env.TARGET_PROTOCOL || 'http';
const targetHost = process.env.TARGET_HOST || '';
const targetPort = process.env.TARGET_PORT ? ':' + process.env.TARGET_PORT : '';

const cacheDir = process.env.CACHE_DIR || '../cache';
const cacheTtl = Number(process.env.CACHE_TTL_MILLISECONDS || 5000);

const caching = new FileCachingService(path.resolve(cacheDir));

const logger = winston.createLogger({
    format: format.combine(format.splat(), format.simple()),
    transports: [new transports.Console()],
});

const app: Application = express();
app.use(bodyParser.json());

app.use(
    '/',
    checkCacheMiddleware(caching, logger),
    createProxyMiddleware({
        target: `${targetProtocol}://${targetHost}${targetPort}`,
        changeOrigin: true,
        secure: false,
        selfHandleResponse: true,
        logProvider: () => logger,
        onProxyRes: responseInterceptor(
            saveCacheInterceptor(caching, logger, cacheTtl),
        ),
    }),
);

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
    console.log(`worker pid=${process.pid}`);
});
