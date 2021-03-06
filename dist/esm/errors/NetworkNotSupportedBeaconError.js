import { BeaconError, BeaconErrorType } from '..';
/**
 * @category Error
 */
export class NetworkNotSupportedBeaconError extends BeaconError {
    constructor() {
        super(BeaconErrorType.NETWORK_NOT_SUPPORTED, 'The wallet does not support this network. Please select another one.');
        this.name = 'NetworkNotSupportedBeaconError';
        this.title = 'Network Error';
    }
}
//# sourceMappingURL=NetworkNotSupportedBeaconError.js.map