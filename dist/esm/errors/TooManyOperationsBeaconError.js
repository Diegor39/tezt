import { BeaconError, BeaconErrorType } from '..';
/**
 * @category Error
 */
export class TooManyOperationsBeaconError extends BeaconError {
    constructor() {
        super(BeaconErrorType.TOO_MANY_OPERATIONS, 'The request contains too many transactions. Please include fewer operations and try again.');
        this.name = 'TooManyOperationsBeaconError';
        this.title = 'Too Many Operations';
    }
}
//# sourceMappingURL=TooManyOperationsBeaconError.js.map