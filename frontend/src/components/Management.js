import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as FA from 'react-icons/lib/fa';

import './css/Management.css';

class Management extends Component {
	add() {
		const item = prompt('Item name');

		if(item !== null && item.length > 0) {

		}
	}

	render() {
		return <div id='management'>
			<button className='btn' onClick={this.props.cancel}>cancel</button>

			<h4>Management</h4>

			<h5>Items</h5>
			<div className='items'>
				{
					this.props.items.length === 0 ? <p className='none'>&lt;none&gt;</p> : null
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
	
})(Management);