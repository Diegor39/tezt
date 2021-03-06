import { BeaconError, BeaconErrorType } from '..';
/**
 * @category Error
 */
export class NotGrantedBeaconError extends BeaconError {
    constructor() {
        super(BeaconErrorType.NOT_GRANTED_ERROR, 'You do not have the necessary permissions to perform this action. Please initiate another permission request and give the necessary permissions.');
        this.name = 'NotGrantedBeaconError';
        this.title = 'Permission Not Granted';
    }
}
//# sourceMappingURL=NotGrantedBeaconError.js.map