import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { z } from 'zod';
import { httpService } from '../http-service';
import { apiPaths } from '../api-paths';
import { validateResponse } from '@services/validate-response';
import { useGraphPageChartParams } from '@utils/hooks/use-graph-page-chart-params';
import { useDebounce } from 'use-debounce';

const hmtDailyStatSchemaResponseSchema = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
	results: z.array(
		z.object({
			totalTransactionAmount: z.string().transform((value, ctx) => {
				const valueAsNumber = Number(value);
				if (Number.isNaN(valueAsNumber)) {
					ctx.addIssue({
						path: ['totalTransactionAmount'],
						code: z.ZodIssueCode.custom,
					});
				}

				return valueAsNumber / 10 ** 18;
			}),
			totalTransactionCount: z.number(),
			dailyUniqueSenders: z.number(),
			dailyUniqueReceivers: z.number(),
			date: z.string(),
		})
	),
});

export type HMTDailyStatsResponse = z.output<
	typeof hmtDailyStatSchemaResponseSchema
>;
export type HMTDailyStat = HMTDailyStatsResponse['results'][number];

const hcaptchaDailyStatsResponseSchema = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
	results: z.array(
		z.object({
			served: z.number(),
			solved: z.number(),
			date: z.string(),
		})
	),
});

export type HcaptchaDailyStatsResponse = z.infer<
	typeof hcaptchaDailyStatsResponseSchema
>;
export type HcaptchaDailyStat = HcaptchaDailyStatsResponse['results'][number];

export type GraphPageChartData = (HMTDailyStat &
	Omit<HcaptchaDailyStat, 'date'>)[];

const mergeResponses = (
	hcaptchaStatsResults: HcaptchaDailyStat[],
	hmtStatsResults: HMTDailyStat[]
): GraphPageChartData => {
	const result: GraphPageChartData = [];
	// console.log({ hcaptchaStatsResults: , hmtStatsResults });

	for (let i = 0; i < hcaptchaStatsResults.length; i++) {
		result.push({ ...hcaptchaStatsResults[i], ...hmtStatsResults[i] });
		console.log(i);
	}
	return result;
};

const DEBOUNCE_MS = 300;

export function useGraphPageChartData() {
	const { dateRangeParams } = useGraphPageChartParams();
	const queryParams = {
		from: dateRangeParams.from.format('YYYY-MM-DD'),
		to: dateRangeParams.to.format('YYYY-MM-DD'),
	};
	const [debouncedQueryParams] = useDebounce(queryParams, DEBOUNCE_MS);

	return useQuery({
		queryFn: async () => {
			const { data: hmtDailyStats } = await httpService.get(
				apiPaths.hmtDailyStats.path,
				{
					params: debouncedQueryParams,
				}
			);
			const { data: hcaptchDailyStats } = await httpService.get(
				apiPaths.hcaptchaStatsDaily.path,
				{
					params: debouncedQueryParams,
				}
			);

			const validHmtDailyStats = validateResponse(
				hmtDailyStats,
				hmtDailyStatSchemaResponseSchema
			);

			const validHcaptchaGeneralStats = validateResponse(
				hcaptchDailyStats,
				hcaptchaDailyStatsResponseSchema
			);

			return mergeResponses(
				validHcaptchaGeneralStats.results,
				validHmtDailyStats.results
			);
		},
		staleTime: DEBOUNCE_MS,
		queryKey: ['useGraphPageChartData', debouncedQueryParams],
		placeholderData: keepPreviousData,
	});
}
