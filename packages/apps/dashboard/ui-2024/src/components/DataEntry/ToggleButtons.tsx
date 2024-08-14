import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { colorPalette } from '@assets/styles/color-palette';
import {
	TIME_PERIOD_OPTIONS,
	useGraphPageChartParams,
} from '@utils/hooks/use-graph-page-chart-params';

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
	'.MuiToggleButtonGroup-grouped': {
		border: 'none',
		borderRadius: 4,
		width: 50,
		color: colorPalette.primary.main,
	},
});

const ToggleButtons = () => {
	const { setTimePeriod, selectedTimePeriod, dateRangeParams } =
		useGraphPageChartParams();
	return (
		<StyledToggleButtonGroup
			value={selectedTimePeriod}
			aria-label="text-alignment"
			exclusive
		>
			{TIME_PERIOD_OPTIONS.map((elem) => (
				<ToggleButton
					onClick={() => {
						setTimePeriod(elem);
					}}
					selected={elem.value.isSame(dateRangeParams.from)}
					key={elem.name}
					sx={{
						'.MuiTypography-root': {
							wordBreak: 'normal',
						},
						'&.Mui-selected': {
							backgroundColor: colorPalette.primary.main,
							color: colorPalette.white,
						},
						'&.Mui-selected:hover': {
							cursor: 'pointer',
							backgroundColor: colorPalette.primary.main,
						},
					}}
					value={elem.name}
				>
					<Typography fontWeight={600}>{elem.name}</Typography>
				</ToggleButton>
			))}
		</StyledToggleButtonGroup>
	);
};

export default ToggleButtons;
