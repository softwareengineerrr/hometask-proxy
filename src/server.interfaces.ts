import { OutgoingHttpHeaders } from 'http';

export interface Logger {
    log(message?: unknown, ...optionalParams: unknown[]): void;
    info(message?: unknown, ...optionalParams: unknown[]): void;
    warn(message?: unknown, ...optionalParams: unknown[]): void;
    error(message?: unknown, ...optionalParams: unknown[]): void;
}

export interface CachedResponse {
    headers: OutgoingHttpHeaders;
    response: string;
    statusCode: number;
}
