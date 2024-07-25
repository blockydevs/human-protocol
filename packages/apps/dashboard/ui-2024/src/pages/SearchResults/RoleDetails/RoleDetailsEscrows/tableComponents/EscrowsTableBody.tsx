import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import MuiTableBody from '@mui/material/TableBody';
import { useEffect } from 'react';
import { handleErrorMessage } from '@services/handle-error-message';
import CircularProgress from '@mui/material/CircularProgress';
import { EscrowsTableBodyContainer } from '@pages/SearchResults/RoleDetails/RoleDetailsEscrows/tableComponents/EscrowsTableBodyContainer';
import { useEscrowDetails } from '@services/api/use-escrows-details';
import { AddressDetailsLeader } from '@services/api/use-address-details';
import { useEscrowDetailsDto } from '@utils/hooks/use-escrows-details-dto';

export const EscrowsTableBody = ({
	role,
}: {
	role: AddressDetailsLeader['role'];
}) => {
	const { data, isPending, isError, error } = useEscrowDetails({ role });
	const {
		setLastPageIndex,
		setPrevPage,
		pagination: { page },
	} = useEscrowDetailsDto();

	useEffect(() => {
		if (data?.results.length === 0) {
			setLastPageIndex(page);
			setPrevPage();
		}
	}, [data?.results, page, setLastPageIndex, setPrevPage]);

	if (isPending) {
		return (
			<EscrowsTableBodyContainer>
				<CircularProgress />
			</EscrowsTableBodyContainer>
		);
	}

	if (isError) {
		return (
			<EscrowsTableBodyContainer>
				<div>{handleErrorMessage(error)}</div>
			</EscrowsTableBodyContainer>
		);
	}

	if (!data.results.length) {
		return (
			<EscrowsTableBodyContainer>
				<div>No data</div>
			</EscrowsTableBodyContainer>
		);
	}

	return (
		<MuiTableBody>
			{data.results.map((elem, idx) => (
				<TableRow key={idx}>
					<TableCell
						sx={{
							padding: '0 0 24px 0',
						}}
					>
						{elem.address}
					</TableCell>
				</TableRow>
			))}
		</MuiTableBody>
	);
};
