import { useHMTPrice } from '../../services/api/use-hmt-price';
import Typography from '@mui/material/Typography';
import { handleErrorMessage } from '../../services/handle-error-messsage';

export function HMTPrice() {
	const { data, status, error } = useHMTPrice();
	console.log(handleErrorMessage(error));
	return (
		<div>
			<Typography variant="h6" component="p">
				HMT Price
			</Typography>
			<div className="count">
				{status === 'success' && data.hmtPrice}
				{status === 'pending' && '...'}
				{status === 'error' && 'No data'}
			</div>
		</div>
	);
}
