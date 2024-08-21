import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import SimpleBar from 'simplebar-react';
import { Table } from '@components/Home/Leaderboard/components/Table/Table';
import { SelectNetwork } from '@components/Home/Leaderboard/components/SelectNetwork';
import { useLeaderboardDetails } from '@services/api/use-leaderboard-details';
import Loader from '@components/Loader';
import Stack from '@mui/material/Stack';
import { handleErrorMessage } from '@services/handle-error-message';

const Leaderboard = () => {
	const { data, status, error } = useLeaderboardDetails();

	if (status === 'pending') {
		return <Loader height="30vh" />;
	}

	if (status === 'error') {
		return (
			<Stack sx={{ paddingTop: '2rem' }}>{handleErrorMessage(error)}</Stack>
		);
	}

	return (
		<>
			<TableContainer
				component={Paper}
				sx={{ padding: '32px', marginTop: '30px' }}
			>
				<div className="mobile-select">
					<SelectNetwork />
				</div>
				<SimpleBar>
					<Table data={data} />
				</SimpleBar>
			</TableContainer>
		</>
	);
};

export default Leaderboard;
