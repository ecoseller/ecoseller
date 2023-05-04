import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ChecklistRenderer = ({data}) => {
	let content = null;
	console.log("checklist_data",data);
	if (data.items && Array.isArray(data.items)) {
		content = data.items.map((item:any,index:number) => {
			return (
				<div key={index}>
					<FormControlLabel
						value={`input-`+index}
						control={<Checkbox checked={item.checked === true ? true : false} disableRipple={true} readOnly={true} icon={<CheckCircleOutlineIcon />} checkedIcon={<CheckCircleIcon />} />}
						label={item.text}
						labelPlacement="end"
					/>
				</div>
			)
		})
	}
	return (
		<>{content}</>
	)
}

export default ChecklistRenderer;