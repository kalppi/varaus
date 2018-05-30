import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import BookingTable from './components/BookingTable';
import Info from './components/Info';
import Nav from './components/Nav';
import Minimap from './components/Minimap';
import Overlay from './components/Overlay';
import Switch from './components/Switch';
import CustomerSelectList from './components/CustomerSelectList';
import BookingOptions from './components/BookingOptions';
import Management from './components/Management';
import Login from './components/Login';
import History from './components/History';
import { SearchResults } from './components/Search';
import { setDate, setUser } from './reducers/appReducer';
import { loadBookings } from './reducers/bookingsReducer';
import { loadItems } from './reducers/itemsReducer';

import './App.css';

class App extends Component {
	componentDidMount() {
		const userJSON = window.localStorage.getItem('user');

		if(userJSON) {
			const user = JSON.parse(userJSON);

			this.props.setUser(user);

			this.init();
		}
	}

	init() {
		this.props.init(moment('20181017', 'YYYYMMDD'));
	}

	render() {
		return <Login onLogin={this.init.bind(this)}>
				<div>
					<Nav />

					<Overlay options={this.props.overlay}>
						<Switch value={this.props.overlay.type}>
							<CustomerSelectList case='customers' customers={this.props.customers} />
							<BookingOptions case='options' />
							<Management case='management' />
						</Switch>
					</Overlay>

					<div className='container-fluid'>
						<div className='row'>
							{
								this.props.showSearchResults ?
									<div className='col-md-12'>
										<SearchResults />
									</div>
								: this.props.showHistory ? 
									<div className='col-md-12'>
										<History history={this.props.history} />
									</div>
								: [
									<div className='col-md-3' key='left'>
										<Info />
									</div>,
									<div className='col-md-9 nopadding' key='right'>
										<Minimap key='minimap' />
										<BookingTable key='booking-table' />
									</div>
								]
							}
						</div>
					</div>
				</div>	
			</Login>;
	}
}

export default connect((state) => {
	return {
		showSearchResults: state.app.searchResults !== null,
		showHistory: state.app.showHistory,
		history: state.app.history,
		overlay: state.overlay.overlay,
		customers: state.overlay.customers,
	}
}, {
	loadBookings, loadItems, setDate, setUser,
}, (stateProps, dispatchProps, ownProps) => {
	return Object.assign({
		init: (date) => {
			dispatchProps.setDate(date);
			dispatchProps.loadItems();
			dispatchProps.loadBookings();
		}
	}, ownProps, dispatchProps, stateProps);
})(App);
