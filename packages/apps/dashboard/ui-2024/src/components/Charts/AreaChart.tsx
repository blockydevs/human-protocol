import {
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
	AreaChart as AreaChartRecharts,
	Area,
	ResponsiveContainer,
} from 'recharts';
import CustomChartTooltip from './CustomChartTooltip';
import { useEffect, useMemo, useRef, useState } from 'react';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { colorPalette } from '@assets/styles/color-palette';
import CustomXAxisTick from '@components/Charts/CustomXAxisTick';
import DatePicker from '@components/DataEntry/DatePicker';
import ToggleButtons from '@components/DataEntry/ToggleButtons';
import { Dayjs } from 'dayjs';
import ToggleCharts from '@components/Charts/ToggleCharts';
import { formatNumber } from '@helpers/formatNumber';
import {
	GraphPageChartData,
	useGraphPageChartData,
} from '@services/api/use-graph-page-chart-data';
import { useGraphPageChartParams } from '@utils/hooks/use-graph-page-chart-params';

const CHECKED_CHARTS_DEFAULT_STATE = {
	transferAmount: true,
	transactionsCount: true,
	uniqueReceivers: true,
	uniqueSenders: true,
};
const HOVERED_CHARTS_DEFAULT_STATE = {
	transferAmount: false,
	transactionsCount: false,
	uniqueReceivers: false,
	uniqueSenders: false,
};

export const AreaChart = ({ chartData }: { chartData: GraphPageChartData }) => {
	const {
		setFromDate,
		setToDate,
		clearTimePeriod,
		dateRangeParams: { from, to },
	} = useGraphPageChartParams();

	const lastIndex = chartData.length - 1;
	const [checkedCharts, setCheckedCharts] = useState(
		CHECKED_CHARTS_DEFAULT_STATE
	);
	const chartRef = useRef<HTMLDivElement>(null);
	const [currentHoveredChart, setCurrentHoveredChart] = useState(
		HOVERED_CHARTS_DEFAULT_STATE
	);

	const toggleChart = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCheckedCharts((prevState) => ({
			...prevState,
			[event.target.name]: event.target.checked,
		}));
	};

	const onFromDateChange = (value: Dayjs | null) => {
		if (value) setFromDate(value);
	};

	const onToDateChange = (value: Dayjs | null) => {
		if (value) setToDate(value);
	};

	const onChartHover = (name: string) => {
		setCurrentHoveredChart((prevState) => ({
			...prevState,
			[name]: true,
		}));
	};

	const onChartLeave = () => {
		setCurrentHoveredChart(HOVERED_CHARTS_DEFAULT_STATE);
	};

	useEffect(() => {
		const currentRef = chartRef.current;
		if (currentRef) {
			const handleScrollChangeDate = (event: WheelEvent) => {
				event.preventDefault();
				clearTimePeriod();
				if (event.deltaY < 0) {
					if (from.add(1, 'day').isAfter(to) || from.add(1, 'day').isSame(to)) {
						return;
					}
					setFromDate(from.add(1, 'day'));
				} else if (event.deltaY > 0) {
					setFromDate(from.subtract(1, 'day'));
				}
			};

			currentRef.addEventListener('wheel', handleScrollChangeDate);

			return () => {
				currentRef.removeEventListener('wheel', handleScrollChangeDate);
			};
		}
	}, [clearTimePeriod, from, setFromDate, to]);

	return (
		<Card
			sx={{
				paddingY: { xs: 4, md: 4 },
				paddingX: { xs: 2, md: 8 },
			}}
		>
			<Stack
				sx={{ marginBottom: 4 }}
				direction={{ xs: 'column', md: 'row' }}
				gap={{ xs: 6, md: 8 }}
			>
				<ToggleButtons />
				<Stack direction="row" alignItems="center" gap={2}>
					<DatePicker onChange={onFromDateChange} value={from} />
					<Typography>-</Typography>
					<DatePicker onChange={onToDateChange} value={to} />
				</Stack>
			</Stack>
			<ResponsiveContainer ref={chartRef} height={300}>
				<AreaChartRecharts data={chartData}>
					<defs>
						<linearGradient
							id="colorTotalTransactionAmount"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset={currentHoveredChart.transferAmount ? '20%' : '30%'}
								stopColor="#330B8D33"
								stopOpacity={currentHoveredChart.transferAmount ? 1 : 0.2}
							/>
							<stop
								offset={currentHoveredChart.transferAmount ? '90%' : '60%'}
								stopColor="#330B8D00"
								stopOpacity={currentHoveredChart.transferAmount ? 1 : 0}
							/>
						</linearGradient>
						<linearGradient
							id="colorTotalTransactionCount"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset={currentHoveredChart.transactionsCount ? '20%' : '30%'}
								stopColor="#6309FF26"
								stopOpacity={currentHoveredChart.transactionsCount ? 1 : 0.2}
							/>
							<stop
								offset={currentHoveredChart.transactionsCount ? '90%' : '60%'}
								stopColor="#6309FF00"
								stopOpacity={currentHoveredChart.transactionsCount ? 1 : 0}
							/>
						</linearGradient>
						<linearGradient
							id="colorDailyUniqueReceivers"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset={currentHoveredChart.uniqueReceivers ? '20%' : '30%'}
								stopColor="#F20D5F33"
								stopOpacity={currentHoveredChart.uniqueReceivers ? 1 : 0.2}
							/>
							<stop
								offset={currentHoveredChart.uniqueReceivers ? '90%' : '60%'}
								stopColor="#F20D5F00"
								stopOpacity={currentHoveredChart.uniqueReceivers ? 1 : 0}
							/>
						</linearGradient>
						<linearGradient
							id="colorDailyUniqueSenders"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset={currentHoveredChart.uniqueSenders ? '20%' : '30%'}
								stopColor="#0AD39780"
								stopOpacity={currentHoveredChart.uniqueSenders ? 1 : 0.2}
							/>
							<stop
								offset={currentHoveredChart.uniqueSenders ? '90%' : '70%'}
								stopColor="#0AD39700"
								stopOpacity={currentHoveredChart.uniqueSenders ? 1 : 0}
							/>
						</linearGradient>
					</defs>
					<YAxis
						tickFormatter={formatNumber}
						tick={{ dx: -10 }}
						tickSize={0}
						axisLine={false}
						stroke={colorPalette.fog.main}
					/>
					<CartesianGrid stroke="#ccc" strokeDasharray="5" vertical={false} />
					<XAxis
						axisLine={false}
						tick={<CustomXAxisTick />}
						height={50}
						stroke={colorPalette.fog.dark}
						tickSize={20}
						dataKey="name"
						tickMargin={10}
					/>
					<Tooltip content={<CustomChartTooltip />} />
					{checkedCharts.transferAmount && (
						<Area
							type="monotone"
							dataKey="totalTransactionAmount"
							stroke={colorPalette.primary.main}
							fillOpacity={1}
							fill="url(#colorTransferAmount)"
						/>
					)}
					{checkedCharts.transactionsCount && (
						<Area
							type="monotone"
							dataKey="totalTransactionCount"
							stroke={colorPalette.secondary.main}
							fillOpacity={1}
							fill="url(#colorTransactionsCount)"
						/>
					)}
					{checkedCharts.uniqueReceivers && (
						<Area
							type="monotone"
							dataKey="dailyUniqueReceivers"
							stroke={colorPalette.error.main}
							fillOpacity={1}
							fill="url(#colorUniqueRecievers)"
						/>
					)}
					{checkedCharts.uniqueSenders && (
						<Area
							type="monotone"
							dataKey="dailyUniqueSenders"
							stroke={colorPalette.success.main}
							fillOpacity={1}
							fill="url(#colorUniqueSenders)"
						/>
					)}
				</AreaChartRecharts>
			</ResponsiveContainer>
			<Card
				sx={{
					paddingY: 3,
					marginTop: 3,
					marginLeft: { xs: 0, xl: 6 },
					backgroundColor: colorPalette.overlay.light,
				}}
			>
				<ToggleCharts
					handleChange={toggleChart}
					onMouseLeave={onChartLeave}
					onMouseEnter={onChartHover}
					chartOptions={[
						{
							title: 'Transfer Amount',
							isAreaChart: true,
							name: 'totalTransactionAmount',
							amount: chartData[lastIndex]?.totalTransactionAmount,
							color: colorPalette.primary.main,
						},
						{
							title: 'Transactions Count',
							name: 'totalTransactionCount',
							amount: chartData[lastIndex]?.totalTransactionCount,
							color: colorPalette.secondary.main,
						},
						{
							title: 'Unique Receivers',
							name: 'dailyUniqueReceivers',
							amount: chartData[lastIndex]?.dailyUniqueReceivers,
							color: colorPalette.error.main,
						},
						{
							title: 'Unique Senders',
							name: 'dailyUniqueSenders',
							amount: chartData[lastIndex]?.dailyUniqueSenders,
							color: colorPalette.success.main,
						},
					]}
				/>
			</Card>
		</Card>
	);
};
