import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setInfoValues } from '../reducers/appReducer';
import { createBooking, deleteBooking } from '../reducers/bookingsReducer';
import { Form, Field, SingleRow, Button } from 'react-form-helper';
import moment from 'moment';
import { formatDate } from '../utils';

import './Info.css';

class Info extends Component {
	onSubmit = () => {
		if(this.props.selected) {

		} else {
			const values = this.props.values;
			const data = {
				ItemId: values.item.value,
				start: values.start.value.format('YYYY-MM-DD'),
				end: values.end.value.format('YYYY-MM-DD'),
				UserInfo: {
					name: values.name,
					email: values.email
				}
			};

			this.props.createBooking(data);
		}
	}

	format(name, value) {
		switch(name) {
			case 'item':
				return value.text;
			case 'start':
			case 'end':
				return value.text;
			default:
				return value;
		}
	}

	parse(name, value) {
		switch(name) {
			case 'start': {
				const start = {
					text: value,
					value: moment(value.replace(/ /g, ''), 'D.M.YYYY', true)
				};

				const nights = this.props.values.end.value.diff(start.value, 'days');

				this.form.setValue('nights', nights);

				return start;
			}
			case 'end': {
				const end = {
					text: value,
					value: moment(value.replace(/ /g, ''), 'D.M.YYYY', true)
				};

				const nights = end.value.diff(this.props.values.start.value, 'days');

				this.form.setValue('nights', nights);

				return end;
			}
			default:
				return value;
		}
	}

	onBlur(name, value) {
		switch(name) {
			case 'start':
			case 'end':
				if(value.value.isValid()) {
					return {
						text: formatDate(value.value),
						value: value.value
					};
				} else {
					return value;
				}
			default:
				return value;
		}
	}

	render() {
		const { selected, selection } = this.props;
		const buttonType = selected ? 'save' : selection ? 'create' : 'none';

		const buttonOptions = {
			save: {
				text: 'Update',
				deleteText: 'Delete'
			},
			create: {
				text: 'Create',
				deleteText: 'Cancel'
			}
		};

		const button = buttonOptions[buttonType];

		return <div id='info'>
			<Form
				name='info'
				ref={ref => this.form = ref}
				values={this.props.values}
				onSubmit={this.onSubmit}
				onBlur={this.onBlur}
				save={this.props.setValues}
				format={this.format.bind(this)}
				parse={this.parse.bind(this)}
				errors={this.props.errors}
				>
				<Field name='item' editable={false} label={false} />

				<SingleRow>
					<Field name='start' />
					<Field name='end' />
					<Field name='nights' text='#' size='2' editable={false} />
				</SingleRow>
				
				<Field name='name' />
				<Field name='email' />

				{ buttonType !== 'none' ?
					<Button enabled={this.props.buttonEnabled} text={button.text} />
					: null
				}

				{ buttonType === 'save' ?
					<Button text={button.deleteText} className='pull-right' onClick={this.props.deleteBooking.bind(null, this.props.selected.id)} />
					: null
				}
			</Form>
		</div>;
	}
}

export default connect((state) => {
	return {
		selected: state.app.selectedBooking,
		selection: state.app.selection,
		buttonEnabled: state.app.buttonEnabled,
		values: state.app.infoValues,
		errors: state.app.infoErrors
	}
}, {
	setValues: setInfoValues, createBooking, deleteBooking
})(Info);