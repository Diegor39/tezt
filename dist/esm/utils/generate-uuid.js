var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import * as sodium from 'libsodium-wrappers';
/**
 * Generate a random GUID
 */
export function generateGUID() {
    return __awaiter(this, void 0, void 0, function* () {
        yield sodium.ready;
        const buf = sodium.randombytes_buf(16);
        return [buf.slice(0, 4), buf.slice(4, 6), buf.slice(6, 8), buf.slice(8, 10), buf.slice(10, 16)]
            .map(function (subbuf) {
            return Buffer.from(subbuf).toString('hex');
        })
            .join('-');
    });
}
/* eslint-enable prefer-arrow/prefer-arrow-functions */
//# sourceMappingURL=generate-uuid.js.map