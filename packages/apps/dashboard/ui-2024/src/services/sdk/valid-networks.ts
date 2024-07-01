import { ChainId, NETWORKS } from '@human-protocol/sdk';

export const VALID_NETWORKS = Object.entries(NETWORKS).filter(([chainId]) => {
	return (
		Number(chainId) !== ChainId.SKALE &&
		Number(chainId) !== ChainId.LOCALHOST &&
		Number(chainId) !== ChainId.ALL
	);
});
