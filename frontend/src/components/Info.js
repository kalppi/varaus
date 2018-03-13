import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatDate } from '../utils';
import './Info.css';

class Info extends Component {
	render() {
		const { selected } = this.props;

		return <div id='info'>
			<h4>Booking info</h4>

			<div>
				<label htmlFor='info-start'>start</label>
				<input type='text' id='info-start' value={selected ? formatDate(selected.start) : ''} />
			</div>
			<div>
				<label htmlFor='info-start'>end</label>
				<input type='text' id='info-end' value={selected ? formatDate(selected.end) : ''} />
			</div>
		</div>;
	}
}

export default connect((state) => {
	return {
		selected: state.app.selectedBooking
	}
})(Info);