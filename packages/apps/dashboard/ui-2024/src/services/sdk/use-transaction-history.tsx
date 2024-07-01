import { useQuery } from '@tanstack/react-query';
import { TransactionUtils } from '@human-protocol/sdk/src/transaction';
import { VALID_NETWORKS } from './valid-networks';
// import { ChainId } from '@human-protocol/sdk/src';
import { ChainId } from '@human-protocol/sdk';

export function useTransactionHistory() {
	return useQuery({
		queryFn: async () => {
			try {
				const validChainIds = VALID_NETWORKS.map(([chainId]) => {
					return Number(chainId) as ChainId;
				});

				// console.log({ validChainIds });
				console.log({
					validChainIds,
					args: [ChainId.MAINNET, ChainId.POLYGON_AMOY],
				});
				const transactions = await TransactionUtils.getTransactions({
					networks: [ChainId.MAINNET, ChainId.POLYGON_AMOY],
				});
				console.log({ transactions });
			} catch (error) {
				console.log(error);
			}
		},
		queryKey: ['transactionHistory'],
	});
}
