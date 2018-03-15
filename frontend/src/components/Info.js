import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Field, SingleRow } from 'react-form-helper';
import { formatDate } from '../utils';
import './Info.css';

class Info extends Component {
	render() {
		const { selected } = this.props;
		let data = {};

		if(selected) {
			data = {
				item: selected.Item.name,
				start: formatDate(selected.start),
				end: formatDate(selected.end),
				nights: moment(selected.end, 'YYYY-MM-DD').diff(moment(selected.start, 'YYYY-MM-DD'), 'days'),
				name: selected.UserInfo.name,
				email: selected.UserInfo.email
			};
		}

		return <div id='info'>
			<h4>Booking info</h4>

			<Field name='item' value={data.item || ''} />
			<SingleRow>
				<Field name='start' value={data.start || ''} />
				<Field name='end' value={data.end || ''} />
				<Field name='nights' text='#' value={data.nights || ''} size='2' />
			</SingleRow>
			<Field name='name' value={data.name || ''} />
			<Field name='email' value={data.email || ''} />
		</div>;
	}
}

export default connect((state) => {
	return {
		selected: state.app.selectedBooking
	}
})(Info);