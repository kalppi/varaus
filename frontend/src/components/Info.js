import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { formatDate } from '../utils';
import './Info.css';

const Field = ({name, value}) =>
	<div className='group'>
		<label htmlFor={`info-${name}`}>{name}</label>
		<input type='text' id={`info-${name}`} value={value} />
	</div>;

class Info extends Component {
	render() {
		const { selected } = this.props;

		let nights = 0;

		if(selected) {
			nights = moment(selected.end, 'YYYY-MM-DD').diff(moment(selected.start, 'YYYY-MM-DD'), 'days');
		}

		return <div id='info'>
			<h4>Booking info</h4>

			<Field name='item' value={selected ? selected.Item.name : ''} />
			<Field name='start' value={selected ? formatDate(selected.start) : ''} />
			<Field name='end' value={selected ? formatDate(selected.end) : ''} />
			<Field name='nights' value={selected ? nights : ''} />
			<Field name='name' value={selected ? selected.UserInfo.name : ''} />
			<Field name='email' value={selected ? selected.UserInfo.email : ''} />
		</div>;
	}
}

export default connect((state) => {
	return {
		selected: state.app.selectedBooking
	}
})(Info);