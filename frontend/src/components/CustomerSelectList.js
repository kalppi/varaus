import React, { Component } from 'react';
import './CustomerSelectList.css';

export default class CustomerSelectList extends Component {
	onClick(v) {
		this.props.resolve(v);
	}

	render() {
		return <table id="customer-select-list">
			<tbody>
			{ this.props.customers.map((customer, index) => {
				return <tr key={index}>
					<td onClick={this.onClick.bind(this, index)}>a</td>
				</tr>
			}) }
			</tbody>
		</table>
	}
}