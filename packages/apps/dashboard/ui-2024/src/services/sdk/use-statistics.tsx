import { useQuery } from '@tanstack/react-query';
import { ChainId, NETWORKS, StatisticsClient } from '@human-protocol/sdk';
import { HMTStatistics } from '@human-protocol/sdk/dist/graphql';

const VALID_NETWORKS = Object.entries(NETWORKS).filter(([chainId]) => {
	return Number(chainId) !== ChainId.SKALE; // this chain causes timeout
});

export type StatisticsResponse = {
	chainId: string;
	stats: HMTStatistics;
};

export function useStatistics() {
	return useQuery({
		queryFn: async () => {
			const result = await Promise.allSettled(
				VALID_NETWORKS.map(async ([chainId, networkData]) => {
					return {
						chainId,
						stats: await new StatisticsClient(networkData).getHMTStatistics(),
					};
				})
			);
			return result.reduce<StatisticsResponse[]>(
				(allFulfilledStats, currentStats) => {
					if (currentStats.status === 'fulfilled') {
						allFulfilledStats.push(currentStats.value);
					}
					return allFulfilledStats;
				},
				[]
			);
		},
		queryKey: ['useStatistics'],
	});
}
