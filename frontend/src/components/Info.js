import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setInfoValues } from '../reducers/appReducer';
import { Form, Field, SingleRow, Button } from 'react-form-helper';
import { formatDate } from '../utils';

import './Info.css';

class Info extends Component {
	onSubmit = () => {
		
	}

	format(name, value) {
		switch(name) {
			case 'start':
			case 'end':
				return formatDate(value);
			default:
				return value;
		}
	}

	render() {
		const { selected, selection } = this.props;
		const buttonType = selected ? 'save' : selection ? 'create' : 'none';

		const buttonOptions = {
			save: { text: 'Save' },
			create: { text: 'Create '}
		};

		let button = null;

		if(buttonType !== 'none') {
			const options = buttonOptions[buttonType];
			button = <Button enabled={this.props.buttonEnabled} text={options.text} />
		}

		return <div id='info'>
			<h4>Booking info</h4>

			<Form
				ref={ref => this.form = ref}
				onSubmit={this.onSubmit}
				name='info'
				save={this.props.setValues}
				values={this.props.values}
				format={this.format}
				>
				<Field name='item' />

				<SingleRow>
					<Field name='start' />
					<Field name='end' />
					<Field name='nights' text='#' size='2' editable={false} />
				</SingleRow>
				
				<Field name='name' />
				<Field name='email' />

				{ button  }
			</Form>
		</div>;
	}
}

const hasChanged = (selected, values) => {
	if(values.item === undefined) return false;

	const changed = [];

	if(values.item.value !== selected.ItemId) changed.push('item');
	if(values.start !== selected.start) changed.push('start');
	if(values.end !== selected.end) changed.push('end');
	if(values.name !== selected.UserInfo.name) changed.push('name');
	if(values.email !== selected.UserInfo.email) changed.push('email');
/*
	console.log(changed);

	console.log(values.item);
	console.log(selected.ItemId)*/

	return changed.length > 0;
};

const validValues = (values) => {
	const errors = [];

	const { name = '', email = '' } = values;

	if(name.length === 0) errors.push('name');
	if(email.length < 5 || email.indexOf('@') === -1) errors.push('email');

	if(errors.length === 0) {
		return { isValid: true };
	}else {
		return { isValid: false, errors };
	}
}

export default connect((state) => {
	let buttonEnabled = false;

	const { infoValues, selectedBooking } = state.app;
	
	if(infoValues) {
		if(selectedBooking) {
			const changed = hasChanged(selectedBooking, infoValues);

			if(changed) {
				const valid = validValues(infoValues);
				buttonEnabled = valid.isValid;
			}
		} else {
			const valid = validValues(infoValues);
			buttonEnabled = valid.isValid;
		}
	}

	return {
		selected: selectedBooking,
		selection: state.app.selection,
		buttonEnabled: buttonEnabled,
		values: state.app.infoValues
	}
}, {
	setValues: setInfoValues
})(Info);