import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as FA from 'react-icons/lib/fa';
import { formatDate, formatDateTime } from '../utils';
import History from './History';
import { deleteBooking } from '../reducers/bookingsReducer';

import './css/BookingOptions.css';

class BookingOptions extends Component {
	itemName(history) {
		switch(history.type) {
			case 'create':
				return 'Created';
			case 'change':
				return 'Updated';
			default:
				return '';
		}
	}

	formatValue(field, value) {
		switch(field) {
			case 'start':
			case 'end':
				return formatDate(value);
			default:
				return value;
		}
	}

	changedFields(history) {
		const fields = history.data.fields;

		
		return Object.keys(fields).map(k => {
			return <tr key={history.id + '-' + k}>
				<td></td>
				<td className='field'>{k}</td>
				<td className='old'>{this.formatValue(k, fields[k].old)}</td>
				<td className='arrow'>→</td>
				<td className='new'>{this.formatValue(k, fields[k].new)}</td>
			</tr>
		});
	}

	delete() {
		this.props.deleteBooking(this.props.booking.id);

		this.props.cancel();
	}

	render() {
		return <div id='booking-options'>
			<button className='btn' onClick={this.props.cancel}>cancel</button>

			<h4>Actions</h4>
			<div>
				<button className='btn delete' onClick={this.delete.bind(this)}><FA.FaTrash className='icon' /> Delete booking</button>
			</div>

			<History history={this.props.history} hideClose={true} />
		</div>;
	}
}

export default connect((state) => {
	return {
		history: state.overlay.bookingInfo.history,
		booking: state.overlay.bookingInfo.booking
	}
}, {
	deleteBooking
})(BookingOptions);