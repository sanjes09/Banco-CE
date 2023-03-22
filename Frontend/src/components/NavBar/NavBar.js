import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import './navbar.css';
import {logout} from '../../config/token';

export class NavBar extends Component {

	render() {
		return (
			<Nav className="justify-content-end align-items-center NavBar" style={{height: '75px'}}>
				<Nav.Item className="ml-4 mr-auto">
					{/* <img src={ Logo } alt="" style={{width:"17vw"}}/> */}
				</Nav.Item>
				<Nav.Item>
					<Link className={`superCenter text-center nav-link ${this.props.pathname == "/" ? 'active' : ''}`} to="/" style={{height: '75px'}}>Home</Link>
				</Nav.Item>
				{this.props.auth?
					<Nav.Item>
						<Link className={`superCenter text-center nav-link ${this.props.pathname == "/dashboard" ? 'active' : ''}`} to="/dashboard" style={{height: '75px'}}>Dashboard</Link>
					</Nav.Item>
				:
				null}
				{!this.props.auth?
					<Nav.Item>
						<Link className={`superCenter text-center nav-link ${this.props.pathname == "/register" ? 'active' : ''}`} to="/register" style={{height: '75px'}}>Register</Link>
					</Nav.Item>
				:
				null
				}
				<Nav.Item>
					{!this.props.auth ?
						<Link to='/login' className="btn mx-3 nav-button">
							Log in
						</Link>
					:
						<span className="superCenter text-center nav-link" onClick={logout} style={{cursor: 'pointer'}}>
							Log Out
						</span>
					}
				</Nav.Item>
			</Nav>  
		)
	}
}

export default NavBar;
