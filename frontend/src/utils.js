import moment from 'moment';

export const formatDate = (date) => {
	const mDate =  moment(date, 'YYYY-MM-DD');

	if(!mDate.isValid()) {
		return '';
	}

	return mDate.format('DD.MM. YYYY');
};