import { Optional } from '../../../utils/utils';
import { AppMetadata, PermissionRequest, OperationRequest, SignPayloadRequest, BroadcastRequest } from '../../..';
/**
 * @category Wallet
 */
export declare type IgnoredRequestOutputProperties = 'version';
/**
 * @category Wallet
 */
export interface ExtraResponseOutputProperties {
    appMetadata: AppMetadata;
}
/**
 * @category Wallet
 */
export declare type PermissionRequestOutput = Optional<PermissionRequest, IgnoredRequestOutputProperties> & ExtraResponseOutputProperties;
/**
 * @category Wallet
 */
export declare type OperationRequestOutput = Optional<OperationRequest, IgnoredRequestOutputProperties> & ExtraResponseOutputProperties;
/**
 * @category Wallet
 */
export declare type SignPayloadRequestOutput = Optional<SignPayloadRequest, IgnoredRequestOutputProperties> & ExtraResponseOutputProperties;
/**
 * @category Wallet
 */
/**
 * @category Wallet
 */
export declare type BroadcastRequestOutput = Optional<BroadcastRequest, IgnoredRequestOutputProperties> & ExtraResponseOutputProperties;
/**
 * @internalapi
 * @category Wallet
 */
export declare type BeaconRequestOutputMessage = PermissionRequestOutput | OperationRequestOutput | SignPayloadRequestOutput | BroadcastRequestOutput;
