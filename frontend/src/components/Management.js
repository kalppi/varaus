import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createItem, moveUp, moveDown } from '../reducers/itemsReducer';
import * as FA from 'react-icons/lib/fa';

import './css/Management.css';

class Management extends Component {
	add() {
		const item = prompt('Item name');

		if(item !== null && item.length > 0) {
			this.props.createItem({name: item});
		}
	}

	up(id) {
		this.props.moveUp(id);
	}

	down(id) {
		this.props.moveDown(id);
	}

	items() {
		return <table className='table'>
			<thead>
				<tr>
					<th className='order'>order</th>
					<th className='up'>up</th>
					<th className='down'>down</th>
					<th>name</th>
				</tr>
			</thead>
			<tbody>
			{ 
				this.props.items.map((item, index) => {
					return <tr key={item.id}>
						<td>{item.order}</td>
						<td>{ index > 0 ? <button className='btn' onClick={this.up.bind(this, item.id)}><FA.FaCaretUp /></button> : null}</td>
						<td>{ index < this.props.items.length - 1 ? <button className='btn' onClick={this.down.bind(this, item.id)}><FA.FaCaretDown /></button> : null}</td>
						<td>{item.name}</td>
					</tr>;
				})
			}
			</tbody>
			</table>;
	}

	render() {
		return <div id='management'>
			<button className='btn' onClick={this.props.cancel}>cancel</button>

			<h4>Management</h4>

			<h5>Rooms</h5>
			<div className='items'>
				{
					this.props.items.length === 0 ? <p className='none'>&lt;none&gt;</p> : this.items()
				}
				<button className='btn' onClick={this.add.bind(this)}><FA.FaPlusCircle /> add</button>
			</div>
		</div>;
	}
}

export default connect((state) => {
	return {
		items: state.items
	}
}, {
	createItem, moveUp, moveDown
})(Management);