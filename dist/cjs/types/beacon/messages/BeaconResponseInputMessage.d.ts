import { Optional } from '../../../utils/utils';
import { PermissionResponse, OperationResponse, SignPayloadResponse, BroadcastResponse, AcknowledgeResponse, ErrorResponse } from '../../..';
/**
 * @category Wallet
 */
export declare type IgnoredResponseInputProperties = 'senderId' | 'version';
/**
 * @category Wallet
 */
export declare type PermissionResponseInput = Optional<PermissionResponse, IgnoredResponseInputProperties | 'appMetadata'>;
/**
 * @category Wallet
 */
export declare type OperationResponseInput = Optional<OperationResponse, IgnoredResponseInputProperties>;
/**
 * @category Wallet
 */
export declare type SignPayloadResponseInput = Optional<SignPayloadResponse, IgnoredResponseInputProperties>;
/**
 * @category Wallet
 */
/**
 * @category Wallet
 */
export declare type BroadcastResponseInput = Optional<BroadcastResponse, IgnoredResponseInputProperties>;
/**
 * @category Wallet
 */
export declare type AcknowledgeResponseInput = Optional<AcknowledgeResponse, IgnoredResponseInputProperties>;
/**
 * @category Wallet
 */
export declare type ErrorResponseInput = Optional<ErrorResponse, IgnoredResponseInputProperties>;
/**
 * @internalapi
 * @category Wallet
 */
export declare type BeaconResponseInputMessage = PermissionResponseInput | OperationResponseInput | SignPayloadResponseInput | BroadcastResponseInput | AcknowledgeResponseInput | ErrorResponseInput;
