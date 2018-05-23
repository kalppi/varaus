import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as FA from 'react-icons/lib/fa';
import { formatDate, formatDateTime } from '../utils';

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

	render() {
		console.log(this.props.history)

		return <div id='booking-options'>
			<button className='btn' onClick={this.props.cancel}>cancel</button>

			<h4>Actions</h4>
			<div>
				<button className='btn delete'><FA.FaTrash className='icon' /> Delete booking</button>
			</div>

			<h4>History</h4>
			<table className='table'>
				<tbody>
				{
					this.props.history.map(h => {
						return [<tr key={h.id}>
								<td className='time'>{formatDateTime(h.createdAt)}</td>
								<td colSpan='4'>{this.itemName(h)}</td>
							</tr>,
							h.type === 'change' ? this.changedFields(h) : null
						]
					})
				}
				</tbody>
			</table>
		</div>;
	}
}

export default connect((state) => {
	return {
		history: state.overlay.bookingInfo.history
	}
}, {
	
})(BookingOptions);