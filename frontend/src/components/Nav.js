import React, { Component } from 'react';
import { Search } from './Search';

import './css/Nav.css';

class Nav extends Component {
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
				<div className="collapse navbar-collapse" id='search'>
					<form className="form-inline my-2 m-lg-0">
						<Search />
					</form>
				</div>
			</div>
		</nav>;
	}
}

export default Nav;