var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StorageKey, P2PTransport } from '..';
// const logger = new Logger('DappP2PTransport')
/**
 * @internalapi
 *
 *
 */
export class WalletP2PTransport extends P2PTransport {
    constructor(name, keyPair, storage, matrixNodes, iconUrl, appUrl) {
        super(name, keyPair, storage, matrixNodes, StorageKey.TRANSPORT_P2P_PEERS_WALLET, iconUrl, appUrl);
    }
    addPeer(newPeer, sendPairingResponse = true) {
        const _super = Object.create(null, {
            addPeer: { get: () => super.addPeer }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.addPeer.call(this, newPeer);
            if (sendPairingResponse) {
                yield this.client.sendPairingResponse(newPeer); // TODO: Should we have a confirmation here?
            }
        });
    }
}
//# sourceMappingURL=WalletP2PTransport.js.map