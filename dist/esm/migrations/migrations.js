var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SDK_VERSION } from '../constants';
import { StorageKey } from '..';
import { migrate_0_7_0 } from './migrate-0.7.0';
const migrations = [
    ['0.6.0', () => undefined],
    ['0.7.0', migrate_0_7_0]
];
// This is not used yet
export const migrate = (storage) => __awaiter(void 0, void 0, void 0, function* () {
    const lastSdkVersion = yield storage.get(StorageKey.BEACON_SDK_VERSION);
    // Skip if we are on latest version
    if (lastSdkVersion && lastSdkVersion === SDK_VERSION) {
        return;
    }
    let addMigration = false;
    for (const [version, migrationMethod] of migrations) {
        if (version === lastSdkVersion) {
            addMigration = true;
        }
        if (addMigration) {
            try {
                yield migrationMethod(storage);
            }
            catch (migrationError) {
                console.log(`Migration for ${version} failed!`, migrationError);
            }
        }
    }
    yield storage.set(StorageKey.BEACON_SDK_VERSION, SDK_VERSION);
});
//# sourceMappingURL=migrations.js.map