export declare class StorageService {
    private dbPromise;
    private storeName;
    constructor(dbName?: string, storeName?: string);
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
}
