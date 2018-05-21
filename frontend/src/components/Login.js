import React, { Component } from 'react';
import { connect } from 'react-redux';
import loginService from '../services/loginService';
import { setUser } from '../reducers/appReducer';

import './css/Login.css';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			password: ''
		}
	}

	async handleSubmit(e) {
		e.preventDefault();

		const name = this.state.name;
		const pw = this.state.password;

		const user = await loginService.login(name, pw);

		if(user && user.token) {
			this.props.setUser(user)

			if(this.props.onLogin) this.props.onLogin();
		}
	}

	handleChange(name, e) {
		this.setState({
			[name]: e.target.value
		});
	}

	render() {
		if(this.props.user === null) {
			return <div className='container'>
				<div id='login'>
					<h2>Login</h2>

					<form onSubmit={this.handleSubmit.bind(this)}>
						<div className='form-group row'>
							<label className='col-sm-3 col-form-label'>Name</label>
							<div className='col-sm-9'>
								<input type='text' name='name' className='form-control' value={this.state.name} onChange={this.handleChange.bind(this, 'name')} />
							</div>
						</div>
						<div className='form-group row'>
							<label className='col-sm-3 col-form-label'>Password</label>
							<div className='col-sm-9'>
								<input type='password' name='password' className='form-control' value={this.state.password} onChange={this.handleChange.bind(this, 'password')} />
							</div>
						</div>
						<div className='form-group row'>
							<div className='col-sm-12'>
								<button type='submit' className='btn btn-primary'>Sign in</button>
							</div>
						</div>
					</form>
				</div>
			</div>;
		} else {
			return <div>
				{ this.props.children }
			</div>;
		}
	}
}

export default connect((state) => {
	return {
		user: state.app.user
	}
}, {
	setUser 
})(Login);