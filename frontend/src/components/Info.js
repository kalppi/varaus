import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatDate } from '../utils';
import './Info.css';

const Field = ({name, value}) =>
	<div>
		<label htmlFor={`info-${name}`}>{name}</label>
		<input type='text' id={`info-${name}`} value={value} />
	</div>;

class Info extends Component {
	render() {
		const { selected } = this.props;

		return <div id='info'>
			<h4>Booking info</h4>
			
			<Field name='start' value={selected ? formatDate(selected.start) : ''} />
			<Field name='end' value={selected ? formatDate(selected.end) : ''} />
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