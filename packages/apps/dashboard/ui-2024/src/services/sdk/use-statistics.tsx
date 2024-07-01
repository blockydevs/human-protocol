import { useQuery } from '@tanstack/react-query';
import { StatisticsClient } from '@human-protocol/sdk';
import { HMTStatistics } from '@human-protocol/sdk/dist/graphql';
import { VALID_NETWORKS } from './valid-networks';

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
