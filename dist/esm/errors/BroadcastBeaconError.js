import { BeaconError, BeaconErrorType } from '..';
/**
 * @category Error
 */
export class BroadcastBeaconError extends BeaconError {
    constructor() {
        super(BeaconErrorType.BROADCAST_ERROR, 'The transaction could not be broadcast to the network. Please try again.');
        this.name = 'BroadcastBeaconError';
        this.title = 'Broadcast Error';
    }
}
//# sourceMappingURL=BroadcastBeaconError.js.map