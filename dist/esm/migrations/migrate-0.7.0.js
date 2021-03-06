var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StorageKey } from '..';
export const migrate_0_7_0 = (storage) => __awaiter(void 0, void 0, void 0, function* () {
    // Migrate AccountInfo
    const accountInfos = yield storage.get(StorageKey.ACCOUNTS);
    accountInfos.forEach((accountInfo) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const accountInfoOld = accountInfo;
        // pubKey is now publicKey
        if (accountInfoOld.pubkey) {
            accountInfo.publicKey = accountInfoOld.pubkey;
            delete accountInfoOld.pubkey;
        }
        // connectedAt is now a number
        accountInfo.connectedAt = new Date(accountInfoOld.connectedAt).getTime();
    });
    yield storage.set(StorageKey.ACCOUNTS, accountInfos);
    // Migrate P2PPeers
    const P2PPairingRequests = yield storage.get(StorageKey.TRANSPORT_P2P_PEERS_DAPP);
    P2PPairingRequests.forEach((p2pPairInfo) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const P2PPairingRequestOld = p2pPairInfo;
        // pubKey is now publicKey
        if (P2PPairingRequestOld.pubKey) {
            p2pPairInfo.publicKey = P2PPairingRequestOld.pubKey;
            delete P2PPairingRequestOld.pubKey;
        }
    });
    yield storage.set(StorageKey.TRANSPORT_P2P_PEERS_DAPP, P2PPairingRequests);
    yield storage.set(StorageKey.BEACON_SDK_VERSION, '0.7.0');
});
//# sourceMappingURL=migrate-0.7.0.js.map