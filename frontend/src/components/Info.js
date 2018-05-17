import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setInfoValues, clearSelection } from '../reducers/appReducer';
import { showCustomersOverlay, showOptionsOverlay, hideOverlay } from '../reducers/overlayReducer';
import { createBooking, deleteBooking } from '../reducers/bookingsReducer';
import { Form, Field, SingleRow, Button, Group } from 'react-form-helper';
import * as FA from 'react-icons/lib/fa';
import moment from 'moment';
import { formatDate } from '../utils';

import './css/Info.css';

class Info extends Component {
	onSubmit = () => {
		if(this.props.selected) {

		} else {
			const values = this.props.values;

			const data = {
				ItemId: values.item.value,
				start: values.start.value.format('YYYY-MM-DD'),
				end: values.end.value.format('YYYY-MM-DD'),
				User: {
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
				if(value && value.value.isValid()) {
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
				text: 'Update'
			},
			create: {
				text: 'Create'
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

				<SingleRow>
					<Field name='item' editable={false} label={false} />

					{ buttonType === 'save' ?
						<Button className='pull-right options' onClick={async () => {
							try {
								await this.props.showOptionsOverlay();
							} catch(e) {
								// cancel
							}
						}}><FA.FaCog /></Button>
						: null
					}
				</SingleRow>

				<SingleRow>
					<Field name='start' />
					<Field name='end' />
					<Field name='nights' text='#' size='2' editable={false} />
				</SingleRow>
				
				<Group text='Customer'>
					<SingleRow>
						<Field name='name' />
						<Button text="#" size='2' enabled={buttonType !== 'none'} onClick={async () => {
							try {
								const v = await this.props.showCustomersOverlay();

								this.form.setValue('name', v.name);
								this.form.setValue('email', v.email);
							} catch(e) {
								// cancel
							}
						}}/>
					</SingleRow>
					<Field name='email' />
				</Group>


				<SingleRow>
					{ buttonType !== 'none' ?
						<Button enabled={this.props.buttonEnabled} text={button.text} />
						: null
					}

					{ buttonType !== 'none' ?
						<Button className='pull-right' onClick={this.props.clearSelection}><FA.FaClose className='cancel icon' /> Cancel</Button>
						: null
					}
				</SingleRow>

				{ /*buttonType === 'save' ?
					<Button
						text={button.deleteText}
						onClick={this.props.deleteBooking.bind(null, this.props.selected.id)}
					/>
					: null*/
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
	setValues: setInfoValues, createBooking, deleteBooking, showCustomersOverlay, showOptionsOverlay, hideOverlay, clearSelection
})(Info);