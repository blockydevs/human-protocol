import React, { useMemo, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Grid';
import AbbreviateClipboard from '@components/SearchResults/AbbreviateClipboard';
import { useNavigate } from 'react-router-dom';
import { ReputationLabel } from '@components/Home/Leaderboard/components/ReputationLabel';
import { EntityIcon } from '@components/Home/Leaderboard/components/EntityIcon';
import { TableHead } from '@components/Home/Leaderboard/components/Table/TableHead';
import { LeaderBoardData } from '@services/api/use-leaderboard-details';
import {
	getComparator,
	Order,
	SortableFieldsInLeaderBoardData,
	stableSort,
} from '@components/Home/Leaderboard/components/Table/sorting';
import { useLeaderboardSearch } from '@utils/hooks/use-leaderboard-search';
import { getNetwork } from '@utils/config/networks';
import { NetworkIcon } from '@components/NetworkIcon';
import { colorPalette } from '@assets/styles/color-palette';

export const Table = ({ data }: { data: LeaderBoardData }) => {
	const navigate = useNavigate();
	const {
		filterParams: { chainId },
	} = useLeaderboardSearch();
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] =
		useState<SortableFieldsInLeaderBoardData>('role');

	const handleRequestSort = (
		_event: React.MouseEvent<unknown>,
		property: SortableFieldsInLeaderBoardData
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const visibleRows = useMemo(() => {
		let filteredRows = data;
		if (chainId !== -1) {
			filteredRows = data.filter((elem) => elem.chainId === chainId);
		}

		return stableSort(filteredRows, getComparator(order, orderBy));
	}, [chainId, data, order, orderBy]);

	return (
		<MuiTable
			sx={{
				minWidth: 650,
				[`& .${tableCellClasses.root}`]: {
					borderBottom: 'none',
				},
			}}
			aria-label="simple table"
		>
			<TableHead
				onRequestSort={handleRequestSort}
				order={order}
				orderBy={orderBy}
				rowCount={data.length}
			/>
			<TableBody>
				{visibleRows.map((row) => (
					<TableRow
						onClick={() => navigate(`/search/${row.chainId}/${row.address}`)}
						key={row.address}
						className="home-page-table-row"
						sx={{
							':hover': {
								backgroundColor: colorPalette.overlay.light,
							},
						}}
					>
						<TableCell>
							<EntityIcon role={row.role} />
							{row.role}
						</TableCell>
						<TableCell>
							<Grid
								container
								wrap="nowrap"
								alignItems="center"
								sx={{ gap: '18px' }}
							>
								<AbbreviateClipboard value={row.address} />
							</Grid>
						</TableCell>
						<TableCell>{row.amountStaked} HMT</TableCell>
						<TableCell>
							<Grid
								container
								wrap="nowrap"
								alignItems="center"
								justifyContent="center"
							>
								<NetworkIcon chainId={row.chainId} />
								{getNetwork(row.chainId)?.name}
							</Grid>
						</TableCell>
						<TableCell>
							<ReputationLabel reputation={row.reputation} />
						</TableCell>
						<TableCell>{row.fee}%</TableCell>
					</TableRow>
				))}
			</TableBody>
		</MuiTable>
	);
};
