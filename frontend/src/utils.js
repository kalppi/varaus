import moment from 'moment';

export const formatDate = (date) => {
	const mDate =  moment(date, 'YYYY-MM-DD');

	if(!mDate.isValid()) {
		return '';
	}

	return mDate.format('D.M. YYYY');
};

export const formatDateTime = (date) => {
	const mDate =  moment(date);

	if(!mDate.isValid()) {
		return '';
	}

	return mDate.format('D.M. YYYY hh:mm:ss');
};

export const formatDateDb = (date) => {
	return date.format('YYYY-MM-DD');
};