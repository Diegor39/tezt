var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { defaultValues } from '../types/storage/StorageKeyReturnDefaults';
/**
 * @internalapi
 *
 * A storage that can be used in chrome extensions
 */
export class ChromeStorage {
    static isSupported() {
        return __awaiter(this, void 0, void 0, function* () {
            return (typeof window !== 'undefined' &&
                typeof chrome !== 'undefined' &&
                Boolean(chrome) &&
                Boolean(chrome.runtime) &&
                Boolean(chrome.runtime.id));
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                chrome.storage.local.get(null, (storageContent) => {
                    if (storageContent[key]) {
                        resolve(storageContent[key]);
                    }
                    else {
                        if (typeof defaultValues[key] === 'object') {
                            resolve(JSON.parse(JSON.stringify(defaultValues[key])));
                        }
                        else {
                            resolve(defaultValues[key]);
                        }
                    }
                });
            });
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [key]: value }, () => {
                    resolve();
                });
            });
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [key]: undefined }, () => {
                    resolve();
                });
            });
        });
    }
}
//# sourceMappingURL=ChromeStorage.js.map