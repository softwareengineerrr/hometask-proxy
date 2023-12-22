export type Caching = {
    set<T>(key: string, value: T, ttl: number): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    del(key: string): Promise<void>;
    clear(): Promise<void>;
};

export type CachingItem = {
    expireAt: number;
    value: unknown;
};
