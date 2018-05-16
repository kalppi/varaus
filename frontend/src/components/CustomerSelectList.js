import React, { Component } from 'react';

import './css/CustomerSelectList.css';

export default class CustomerSelectList extends Component {
	select(v) {
		this.props.resolve(v);
		this.props.hide();
	}

	cancel() {
		this.props.reject();
		this.props.hide();
	}

	render() {
		return <div id="customer-select-list">
				<button className='btn' onClick={this.cancel.bind(this)}>cancel</button>

				<table className='table'>
					<thead>
						<tr>
							<th>#</th><th>name</th><th>email</th>
						</tr>
					</thead>
					<tbody>
					{ this.props.customers.map((customer, index) => {
						return <tr key={index} onClick={this.select.bind(this, customer)}>
							<td>{customer.id}</td>
							<td>{customer.name}</td>
							<td>{customer.email}</td>
						</tr>
					}) }
					</tbody>
				</table>
			</div>
	}
}