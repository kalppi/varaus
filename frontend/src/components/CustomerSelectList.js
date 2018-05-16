import React, { Component } from 'react';
import './CustomerSelectList.css';

export default class CustomerSelectList extends Component {
	render() {
		return <table id="customer-select-list">
			<tbody>
			{ this.props.customers.map((customer, index) => {
				return <tr key={index}>
					<td>a</td>
				</tr>
			}) }
			</tbody>
		</table>
	}
}