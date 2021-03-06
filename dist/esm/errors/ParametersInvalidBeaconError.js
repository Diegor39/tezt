import { BeaconError, BeaconErrorType } from '..';
/**
 * @category Error
 */
export class ParametersInvalidBeaconError extends BeaconError {
    constructor() {
        super(BeaconErrorType.PARAMETERS_INVALID_ERROR, 'Some of the parameters you provided are invalid and the request could not be completed. Please check your inputs and try again.');
        this.name = 'ParametersInvalidBeaconError';
        this.title = 'Parameters Invalid';
    }
}
//# sourceMappingURL=ParametersInvalidBeaconError.js.map