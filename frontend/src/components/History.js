import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideHistory } from '../reducers/appReducer';
import { formatDate, formatDateTime } from '../utils';
import * as FA from 'react-icons/lib/fa';

import './css/History.css';

class History extends Component {
	hide() {
		this.props.hideHistory();
	}

	itemName(history) {
		switch(history.type) {
			case 'create':
				return 'Created';
			case 'change':
				return 'Updated';
			case 'delete':
				return 'Deleted';
			default:
				return history.type;
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
				<td></td>
				<td className='field'>{k}</td>
				<td className='old'>{this.formatValue(k, fields[k].old)}</td>
				<td className='arrow'>→</td>
				<td className='new'>{this.formatValue(k, fields[k].new)}</td>
			</tr>
		});
	}

	render() {
		return <div id='history'>
			{ this.props.hideClose ? null : <button className='btn hide' onClick={this.hide.bind(this)}>close</button> }
			
			<h4>History</h4>
			<table className='table table-sm'>
				<tbody>
				{
					this.props.history.map(h => {
						return [<tr key={h.id}>
								<td className='id'>#{h.id}</td>
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
		
	}
}, {
	hideHistory
})(History);