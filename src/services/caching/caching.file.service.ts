import { Caching, CachingItem } from './caching.interfaces';
import fs from 'fs/promises';
import path from 'path';
import * as lockfile from 'proper-lockfile';
import crypto from 'crypto';

export class FileCachingService implements Caching {
    constructor(private storagePath: string) {}

    async set<T>(key: string, value: T, ttl: number): Promise<void> {
        const release = await lockfile.lock(this.storagePath);
        try {
            await fs.writeFile(
                path.join(this.storagePath, this.hashKey(key)),
                JSON.stringify({
                    expireAt: Date.now() + ttl,
                    value,
                }),
                'utf8',
            );
        } finally {
            await release();
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const file = await this.getFile(key);

        if (!file) {
            return null;
        }

        if (Date.now() > file.expireAt) {
            await this.del(key);

            return null;
        }

        return file.value as T;
    }

    async del(key: string): Promise<void> {
        const release = await lockfile.lock(this.storagePath);
        try {
            await fs.unlink(path.join(this.storagePath, this.hashKey(key)));
        } finally {
            await release();
        }
    }

    async clear(): Promise<void> {
        const release = await lockfile.lock(this.storagePath);

        try {
            const files = await fs.readdir(this.storagePath);
            await Promise.all(files.map((file) => fs.unlink(file)));
        } finally {
            await release();
        }
    }

    private async getFile(key: string): Promise<CachingItem | null> {
        if (!(await this.isFileExist(key))) {
            return null;
        }

        const file = await fs.readFile(
            path.join(this.storagePath, this.hashKey(key)),
            'utf8',
        );

        return file ? JSON.parse(file) : null;
    }

    private hashKey(key: string): string {
        return crypto.createHash('sha256').update(key).digest('hex');
    }

    private async isFileExist(key: string): Promise<boolean> {
        try {
            await fs.access(path.join(this.storagePath, this.hashKey(key)));

            return true;
        } catch (error) {}

        return false;
    }
}
