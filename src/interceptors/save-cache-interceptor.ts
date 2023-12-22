import type * as http from 'http';
import { Caching } from '../services';
import { CachedResponse, Logger } from '../server.interfaces';

export default (caching: Caching, logger: Logger, cacheTtl: number) => {
    return async (
        responseBuffer: Buffer,
        proxyRes: http.IncomingMessage,
        req: http.IncomingMessage,
        res: http.ServerResponse,
    ): Promise<Buffer | string> => {
        const response = responseBuffer.toString('utf8');

        if (
            req.method === 'GET' &&
            req.url &&
            res.statusCode >= 200 &&
            res.statusCode <= 299
        ) {
            try {
                await caching.set<CachedResponse>(
                    req.url,
                    {
                        headers: res.getHeaders(),
                        response: response,
                        statusCode: res.statusCode,
                    },
                    cacheTtl,
                );
            } catch (error) {
                logger.error(error);
            }
        }

        return response;
    };
};
