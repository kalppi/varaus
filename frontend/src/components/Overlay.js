import React, { Component } from 'react';
import './Overlay.css';

export default class Overlay extends Component {
	render() {
		return <div id="overlay">
			<div className='container'>
				<div className='row'>
					<div className='col-md-12'>
						{ this.props.children }
					</div>
				</div>
			</div>
		</div>
	}
}