import { Network, NetworkType } from '..';
export declare abstract class BlockExplorer {
    readonly rpcUrls: {
        [key in NetworkType]: string;
    };
    constructor(rpcUrls: {
        [key in NetworkType]: string;
    });
    protected getLinkForNetwork(network: Network): Promise<string>;
    /**
     * Return a blockexplorer link for an address
     *
     * @param address The address to be opened
     * @param network The network that was used
     */
    abstract getAddressLink(address: string, network: Network): Promise<string>;
    /**
     * Return a blockexplorer link for a transaction hash
     *
     * @param transactionId The hash of the transaction
     * @param network The network that was used
     */
    abstract getTransactionLink(transactionId: string, network: Network): Promise<string>;
}
