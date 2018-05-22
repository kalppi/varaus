import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Search } from './Search';
import { logout } from '../reducers/appReducer';

import './css/Nav.css';

class Nav extends Component {
	logout() {
		this.props.logout();
	}

	render() {
		return <nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className='col-md-3'>
				<div className="collapse navbar-collapse">
					<a className="navbar-brand" href="">Varaus</a>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
				</div>
			</div>
			<div className='col-md-9 nopadding'>
				<div className="collapse navbar-collapse">
					<ul className='navbar-nav mr-auto'>
						<li className='nav-item'>
							<div id='search'>
								<Search />
							</div>
						</li>
					</ul>
					<ul className='navbar-nav'>
						<li className='nav-item'>
							<button id='logout' className='btn' onClick={this.logout.bind(this)}>logout</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>;
	}
}

export default connect((state) => {
	return {

	};
}, {
	logout 
})(Nav);