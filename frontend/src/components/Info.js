import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { setInfoValues } from '../reducers/appReducer';
import { Form, Field, SingleRow } from 'react-form-helper';
import { formatDate } from '../utils';
import './Info.css';

class Info extends Component {
	constructor(props) {
		super(props);

		this.state = {
			values: {}
		};
	}

	onSubmit = () => {
		
	}

	async setValues(values) {
		await this.form.clearValues();

		if(values) await this.form.setValues(values);
		else await this.form.clearValues();

		this.props.setInfoValues(values);
	}

	async componentWillReceiveProps(nextProps) {
		if(!nextProps.selected && !nextProps.selection) {
			this.setValues(null);
			return;
		}

		if(nextProps.selected !== this.props.selected) {
			await this.form.clearValues();

			if(nextProps.selected) {
				const values = {
					item: {
						text: nextProps.selected.Item.name,
						value: nextProps.selected.Item.id
					},
					start: {
						text: formatDate(nextProps.selected.start),
						value: nextProps.selected.start
					},
					end: {
						text: formatDate(nextProps.selected.end),
						value: nextProps.selected.end
					},
					nights: moment(nextProps.selected.end, 'YYYY-MM-DD').diff(moment(nextProps.selected.start, 'YYYY-MM-DD'), 'days'),
					name: nextProps.selected.UserInfo.name,
					email: nextProps.selected.UserInfo.email
				};

				this.setValues(values);
			} else {
				this.setValues(null);
			}
		}

		if(nextProps.selection) {
			const values = {
				item: nextProps.selection.item.name,
				start: formatDate(nextProps.selection.start),
				end: formatDate(nextProps.selection.end),
				nights: moment(nextProps.selection.end, 'YYYY-MM-DD').diff(moment(nextProps.selection.start, 'YYYY-MM-DD'), 'days'),
			};

			this.setValues(values);
		}		
	}

	onChange = (form) => {
		const values = this.form.getValues();
		this.props.setInfoValues(values);
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
			button = <button className='btn' {...options.opts || {}} disabled={!this.props.buttonEnabled}>{options.text}</button>
		}

		return <div id='info'>
			<h4>Booking info</h4>

			<Form ref={ref => this.form = ref} onSubmit={this.onSubmit} onChange={this.onChange} name='info'>
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
	if(values.item.value !== selected.ItemId) return true;
	else if(values.start.value !== selected.start) return  true;
	else if(values.end.value !== selected.end) return true;
	else if(values.name !== selected.UserInfo.name) return true;
	else if(values.email !== selected.UserInfo.email) return true;

	return false;
};

const validValues = (values) => {
	const errors = [];

	if(values.name.length === 0) errors.push('name');
	if(values.email.length < 5 || values.email.indexOf('@') === -1) errors.push('email');

	if(errors.length === 0) {
		return { isValid: true };
	}else {
		return { isValid: false, errors };
	}
}

export default connect((state) => {
	let buttonEnabled = false;

	const { infoValues, selectedBooking } = state.app;

	if(selectedBooking && infoValues) {
		const changed = hasChanged(selectedBooking, infoValues);

		if(changed) {
			const valid = validValues(infoValues);

			buttonEnabled = valid.isValid;
		}
	}

	return {
		selected: selectedBooking,
		selection: state.app.selection,
		buttonEnabled: buttonEnabled
	}
}, {
	setInfoValues
})(Info);