import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TitleSectionWrapper from '@components/SearchResults';
import { colorPalette } from '@assets/styles/color-palette';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SimpleBar from 'simplebar-react';
import AbbreviateClipboard from '@components/SearchResults/AbbreviateClipboard';

const HARDCODED_WALLET_ADDRESS = {
	balance: '111.739994404040404',
	hmtPrice: '0.057',
	stake: '3e-18',
	key: 'Value',
	role: 'Job Launcher',
	name: 'hCapcha',
	transactions: [
		{
			transactionHash: '0xeef...7be7c',
			method: 'Complete',
			block: '4043802',
			value: '0.00003',
			escrowAddress: '0xeef...7be7c',
		},
		{
			transactionHash: '0xeef...d3555',
			method: 'Payout',
			block: '40436',
			value: '0.00003',
			escrowAddress: '0xeef...7be7c',
		},
	],
};

const createData = (
	transactionHash: string,
	method: 'complete' | 'payout',
	block: number,
	value: string,
	escrowAddress: string
) => {
	return { transactionHash, method, block, value, escrowAddress };
};

const rows = [
	createData(
		'0x67499f129433b82e5a4e412143a395e032e76c0dc0f83606031',
		'complete',
		4043802,
		'0.00003 ',
		'0x67499f129433b82e5a4e412143a395e032e76c0dc0f83606031'
	),
	createData(
		'0x67499f129433b82e5a4e412143a395e032e76c0dc0f83606031',
		'payout',
		4043802,
		'0.00003 ',
		'0x67499f129433b82e5a4e412143a395e032e76c0dc0f83606031'
	),
];

const renderMethod = (method: 'complete' | 'payout') => {
	const methodAttributes = {
		complete: {
			title: 'Complete',
			color: {
				text: colorPalette.success.main,
				border: colorPalette.success.light,
			},
		},
		payout: {
			title: 'Payout',
			color: {
				text: colorPalette.secondary.main,
				border: colorPalette.secondary.light,
			},
		},
	};

	const currentStatusColors = methodAttributes[method].color;

	return (
		<Box
			sx={{
				display: 'inline-flex',
				paddingX: 2,
				paddingY: 1,
				borderRadius: 4,
				border: `1px solid ${currentStatusColors.border}`,
			}}
		>
			<Typography>{methodAttributes[method].title}</Typography>
		</Box>
	);
};

const WalletAddress = () => {
	return (
		<>
			<Card
				sx={{
					paddingX: { xs: 2, md: 8 },
					paddingY: { xs: 4, md: 6 },
					marginBottom: 4,
				}}
			>
				<Stack gap={4}>
					<TitleSectionWrapper title="Balance">
						{HARDCODED_WALLET_ADDRESS.balance ? (
							<Typography>
								{HARDCODED_WALLET_ADDRESS.balance}
								<Typography
									sx={{
										marginLeft: 0.5,
									}}
									color={colorPalette.fog.main}
									component="span"
								>
									HMT
								</Typography>
							</Typography>
						) : (
							<Typography>N/A</Typography>
						)}
					</TitleSectionWrapper>

					<TitleSectionWrapper title="HMT Price">
						{HARDCODED_WALLET_ADDRESS.hmtPrice ? (
							<Typography>
								${HARDCODED_WALLET_ADDRESS.hmtPrice}
								<Typography
									sx={{
										marginLeft: 0.5,
									}}
									color={colorPalette.fog.main}
									component="span"
								>
									HMT
								</Typography>
							</Typography>
						) : (
							<Typography>N/A</Typography>
						)}
					</TitleSectionWrapper>
					<TitleSectionWrapper
						title="Stake"
						tooltip={{
							description: 'Amount of HMT locked to secure the Protocol',
						}}
					>
						{HARDCODED_WALLET_ADDRESS.stake ? (
							<Typography>
								{HARDCODED_WALLET_ADDRESS.stake}
								<Typography
									sx={{
										marginLeft: 0.5,
									}}
									color={colorPalette.fog.main}
									component="span"
								>
									HMT
								</Typography>
							</Typography>
						) : (
							<Typography>N/A</Typography>
						)}
					</TitleSectionWrapper>
				</Stack>
			</Card>

			<Card
				sx={{
					paddingX: { xs: 2, md: 8 },
					paddingY: { xs: 4, md: 6 },
					marginBottom: 4,
				}}
			>
				<Typography
					variant="h5"
					component="p"
					sx={{
						marginBottom: 1.5,
					}}
				>
					KV Store
				</Typography>
				<Stack gap={4}>
					<TitleSectionWrapper title="Key">
						<Typography>{HARDCODED_WALLET_ADDRESS.key ?? 'N/A'}</Typography>
					</TitleSectionWrapper>
				</Stack>
				<Divider sx={{ marginY: 3.5 }} />
				<Stack gap={4}>
					<TitleSectionWrapper
						title="Role"
						tooltip={{
							description: 'Same',
						}}
					>
						<Typography>{HARDCODED_WALLET_ADDRESS.role ?? 'N/A'}</Typography>
					</TitleSectionWrapper>
					<TitleSectionWrapper
						title="Stake"
						tooltip={{
							description: 'Amount of HMT locked to secure the Protocol',
						}}
					>
						<Typography>{HARDCODED_WALLET_ADDRESS.name ?? 'N/A'}</Typography>
					</TitleSectionWrapper>
				</Stack>
			</Card>

			<Card
				sx={{
					paddingX: { xs: 2, md: 8 },
					paddingY: { xs: 4, md: 6 },
				}}
			>
				<Typography sx={{ marginBottom: 2 }} variant="h5" component="p">
					Transactions
				</Typography>

				<TableContainer>
					<SimpleBar>
						<Table
							sx={{
								minWidth: 800,
								'& .MuiTableCell-root': {
									borderBottom: 'none',
								},
							}}
							aria-label="simple-table"
						>
							<TableHead
								sx={{
									borderBottom: `1px solid ${colorPalette.fog.main}`,
								}}
							>
								<TableRow>
									<TableCell
										sx={{
											p: 0,
										}}
									>
										<Stack direction="row" alignItems="center">
											<Tooltip title="Transaction identifier">
												<IconButton sx={{ padding: 0, paddingRight: 1 }}>
													<HelpOutlineIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Typography fontWeight={600}>Transaction Hash</Typography>
										</Stack>
									</TableCell>
									<TableCell>
										<Stack direction="row" alignItems="center">
											<Tooltip title="Function executed in the transaction">
												<IconButton sx={{ padding: 0, paddingRight: 1 }}>
													<HelpOutlineIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Typography fontWeight={600}>Method</Typography>
										</Stack>
									</TableCell>
									<TableCell>
										<Stack direction="row" alignItems="center">
											<Tooltip title="Identifier of the block that contains the transaction">
												<IconButton sx={{ padding: 0, paddingRight: 1 }}>
													<HelpOutlineIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Typography fontWeight={600}>Block</Typography>
										</Stack>
									</TableCell>
									<TableCell>
										<Stack direction="row" alignItems="center">
											<Tooltip title="Amount of HMT transferred in the transaction">
												<IconButton sx={{ padding: 0, paddingRight: 1 }}>
													<HelpOutlineIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Typography fontWeight={600}>Value</Typography>
										</Stack>
									</TableCell>
									<TableCell>
										<Stack direction="row" alignItems="center">
											<Tooltip title="same">
												<IconButton sx={{ padding: 0, paddingRight: 1 }}>
													<HelpOutlineIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Typography fontWeight={600}>Escrow Address</Typography>
										</Stack>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map((elem, idx) => (
									<TableRow key={idx}>
										<TableCell
											sx={{
												p: 0,
											}}
										>
											<AbbreviateClipboard value={elem.transactionHash} />
										</TableCell>
										<TableCell>{renderMethod(elem.method)}</TableCell>
										<TableCell>{elem.block}</TableCell>
										<TableCell>
											<Typography>
												{elem.value}
												<Typography component="span">HMT</Typography>
												<Typography
													sx={{
														marginRight: 0,
													}}
													color={colorPalette.fog.main}
													component="span"
												>
													($0.000000001)
												</Typography>
											</Typography>
										</TableCell>
										<TableCell>
											<AbbreviateClipboard value={elem.escrowAddress} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</SimpleBar>
				</TableContainer>
			</Card>
		</>
	);
};

export default WalletAddress;
