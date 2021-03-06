import { Storage, StorageKey, StorageKeyReturnType } from '..';
/**
 * @internalapi
 *
 * A storage that can be used in the browser
 */
export declare class LocalStorage implements Storage {
    private readonly prefix?;
    constructor(prefix?: string | undefined);
    static isSupported(): Promise<boolean>;
    get<K extends StorageKey>(key: K): Promise<StorageKeyReturnType[K]>;
    set<K extends StorageKey>(key: K, value: StorageKeyReturnType[K]): Promise<void>;
    delete<K extends StorageKey>(key: K): Promise<void>;
    private getPrefixedKey;
}
