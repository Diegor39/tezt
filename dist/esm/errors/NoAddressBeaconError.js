import { BeaconError, BeaconErrorType } from '..';
/**
 * @category Error
 */
export class NoAddressBeaconError extends BeaconError {
    constructor() {
        super(BeaconErrorType.NO_ADDRESS_ERROR, 'The wallet does not have an account set up. Please make sure to set up your wallet and try again.');
        this.name = 'NoAddressBeaconError';
        this.title = 'No Address';
    }
}
//# sourceMappingURL=NoAddressBeaconError.js.map