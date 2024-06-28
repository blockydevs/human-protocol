import { StatisticsResponse } from '../services/sdk/use-statistics';

interface StatsSum {
	holders: string;
	totalTransactions: string;
}

export const sumStatistics = (
	allStatistics?: StatisticsResponse[]
): StatsSum => {
	if (!allStatistics) {
		return {
			holders: '-',
			totalTransactions: '-',
		};
	}

	const sum = allStatistics.reduce(
		(statsSum, currentStats) => {
			statsSum.holders += currentStats.stats.totalHolders;
			statsSum.totalTransactions += currentStats.stats.totalTransferCount;
			return statsSum;
		},
		{
			holders: 0,
			totalTransactions: 0,
		}
	);

	return {
		holders: sum.holders.toLocaleString(),
		totalTransactions: sum.totalTransactions.toLocaleString(),
	};
};
