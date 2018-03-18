import React, {Component} from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './Minimap.css';

class Minimap extends Component {
	componentWillReceiveProps(nextProps) {
		if(!nextProps.tableStartDate || !nextProps.tableEndDate) return;

		const scale = 5;

		const days = nextProps.endDate.diff(nextProps.startDate, 'days') + 2;
		const items = nextProps.items.length;

		this.canvas.width = days * scale;
		this.canvas.height = items * scale + 4 + (items - 1);

		const ctx = this.canvas.getContext('2d');
		ctx.fillStyle = '#eee';
		ctx.fillRect(0, 0, days * scale, items * scale + 4 + (items - 1));

		ctx.fillStyle = 'green';

		const rects = nextProps.bookings.reduce((acc, value) => {
			let date = moment(value.start, 'YYYY-MM-DD');
			const endDate = moment(value.end, 'YYYY-MM-DD');
			const itemIndex = nextProps.items.findIndex(item => item.id === value.ItemId);

			while(date.isBefore(endDate)) {
				const dayIndex = date.diff(nextProps.startDate, 'days') + 1;

				date.add(1, 'days');

				if(acc.length > 0) {
					const last = acc[acc.length - 1];

					if(last.id === value.id) {
						last.w++;

						continue;
					}
				}

				acc.push({
					x: dayIndex,
					y: itemIndex,
					w: 1,
					id: value.id
				});
			}		

			return acc;
		}, []);

		for(let rect of rects) {
			ctx.fillRect(rect.x * scale, rect.y * scale + 2 + rect.y, rect.w * scale, scale);			
		}

		const startX = nextProps.tableStartDate.diff(nextProps.startDate, 'days');
		const tableDayDiff = nextProps.tableEndDate.diff(nextProps.tableStartDate, 'days') + 1;

		ctx.strokeStyle = 'red';
		ctx.lineWidth = 1;
		ctx.rect(startX * scale, 0, tableDayDiff * scale + 4, items * scale + 4 + (items - 1));
		ctx.stroke();
	}

	render() {
		return <div id='minimap'>
			<div className='left'>{this.props.startDate.format('D.M. YYYY')}</div>
			<div className='right'>{this.props.endDate.format('D.M. YYYY')}</div>
			<canvas ref={ref => this.canvas = ref} />
		</div>
	}
}

export default connect((state) => {
	return {
		bookings: state.bookings,
		items: state.items,
		startDate: moment(state.app.date).add(-60, 'days'),
		endDate: moment(state.app.date).add(60, 'days'),
		tableStartDate: state.app.startDate,
		tableEndDate: state.app.endDate
	}
}, {
	
})(Minimap);