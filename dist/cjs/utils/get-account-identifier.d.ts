import { Network } from '..';
/**
 * @internalapi
 *
 * Generate a deterministic account identifier based on an address and a network
 *
 * @param address
 * @param network
 */
export declare const getAccountIdentifier: (address: string, network: Network) => Promise<string>;
