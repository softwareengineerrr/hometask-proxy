import { Caching } from '../services';
import type { RequestHandler } from 'express';
import { CachedResponse, Logger } from '../server.interfaces';

export default (caching: Caching, logger: Logger): RequestHandler => {
    return async (req, res, next) => {
        if (req.method === 'GET') {
            try {
                const cachedResponse = await caching.get<CachedResponse>(
                    req.url,
                );

                if (cachedResponse !== null) {
                    for (const [key, value] of Object.entries(
                        cachedResponse.headers,
                    )) {
                        res.setHeader(key, value as string);
                    }

                    res.statusCode = cachedResponse.statusCode;

                    return res.send(cachedResponse.response);
                }
            } catch (error) {
                logger.error(error);
            }
        }

        next();
    };
};
