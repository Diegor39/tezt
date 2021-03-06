import { BeaconError, BeaconErrorType } from '..';
/**
 * @category Error
 */
export class SignatureTypeNotSupportedBeaconError extends BeaconError {
    constructor() {
        super(BeaconErrorType.SIGNATURE_TYPE_NOT_SUPPORTED, 'The wallet is not able to sign payloads of this type.');
        this.name = 'SignatureTypeNotSupportedBeaconError';
        this.title = 'Signature Type Not Supported';
    }
}
//# sourceMappingURL=SignatureTypeNotSupportedBeaconError.js.map