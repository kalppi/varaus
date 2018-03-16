import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { setButtonEnabled } from '../reducers/appReducer';
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

	isValid() {
		const values = this.form.getValues();
		
		if(values.name.length > 0) {
			this.props.setButtonEnabled(true);
		} else {
			this.props.setButtonEnabled(false);
		}
	}

	onSubmit = () => {
		
	}

	async componentWillReceiveProps(nextProps) {
		if(nextProps.selected !== this.props.selected) {
			if(nextProps.selected) {
				const values = {
					item: nextProps.selected.Item.name,
					start: formatDate(nextProps.selected.start),
					end: formatDate(nextProps.selected.end),
					nights: moment(nextProps.selected.end, 'YYYY-MM-DD').diff(moment(nextProps.selected.start, 'YYYY-MM-DD'), 'days'),
					name: nextProps.selected.UserInfo.name,
					email: nextProps.selected.UserInfo.email
				};

				await this.form.clearValues();
				await this.form.setValues(values);

				this.isValid();
			} else {
				this.form.clearValues();
			}
		}

		if(nextProps.selection) {
			const values = {
				item: nextProps.selection.item.name,
				start: formatDate(nextProps.selection.start),
				end: formatDate(nextProps.selection.end),
				nights: moment(nextProps.selection.end, 'YYYY-MM-DD').diff(moment(nextProps.selection.start, 'YYYY-MM-DD'), 'days'),
			};

			await this.form.clearValues();
			await this.form.setValues(values);

			this.isValid();
		}		
	}

	onChange = (form) => {
		this.isValid();
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

export default connect((state) => {
	return {
		selected: state.app.selectedBooking,
		selection: state.app.selection,
		buttonEnabled: state.app.buttonEnabled
	}
}, {
	setButtonEnabled
})(Info);