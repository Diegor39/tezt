var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as sodium from 'libsodium-wrappers';
import * as bs58check from 'bs58check';
/**
 * @internalapi
 *
 * Generate a deterministic account identifier based on an address and a network
 *
 * @param address
 * @param network
 */
export const getAccountIdentifier = (address, network) => __awaiter(void 0, void 0, void 0, function* () {
    const data = [address, network.type];
    if (network.name) {
        data.push(`name:${network.name}`);
    }
    if (network.rpcUrl) {
        data.push(`rpc:${network.rpcUrl}`);
    }
    yield sodium.ready;
    const buffer = Buffer.from(sodium.crypto_generichash(10, data.join('-')));
    return bs58check.encode(buffer);
});
//# sourceMappingURL=get-account-identifier.js.map