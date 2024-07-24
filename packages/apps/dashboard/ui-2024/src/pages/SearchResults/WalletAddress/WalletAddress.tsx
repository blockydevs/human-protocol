import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TitleSectionWrapper from '@components/SearchResults';
import { colorPalette } from '@assets/styles/color-palette';
import Divider from '@mui/material/Divider';
import { AddressDetailsWallet } from '@services/api/use-address-details';
import { useHMTPrice } from '@services/api/use-hmt-price';
import { useWalletSearch } from '@utils/hooks/use-wallet-search';
import { WalletAddressTransactionsTable } from '@pages/SearchResults/WalletAddress/WalletAddressTransactions/WalletAddressTransactionsTable';

const HARDCODED_WALLET_ADDRESS = {
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

const HmtPrice = () => {
	const {
		data: hmtPrice,
		isError: isHmtPriceError,
		isPending: isHmtPricePending,
	} = useHMTPrice();

	if (isHmtPriceError) {
		return <TitleSectionWrapper title="HMT Price">N/A</TitleSectionWrapper>;
	}

	if (isHmtPricePending) {
		return <TitleSectionWrapper title="HMT Price">...</TitleSectionWrapper>;
	}

	return (
		<TitleSectionWrapper title="HMT Price">
			<Typography>
				<>{hmtPrice.hmtPrice}</>
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
		</TitleSectionWrapper>
	);
};

const WalletAddress = ({
	data: { balance },
}: {
	data: AddressDetailsWallet;
}) => {
	const { filterParams } = useWalletSearch();

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
						<Typography>
							{balance}
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
					</TitleSectionWrapper>
					<HmtPrice />
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
			{filterParams.address && filterParams.chainId ? (
				<WalletAddressTransactionsTable />
			) : null}
		</>
	);
};

export default WalletAddress;
