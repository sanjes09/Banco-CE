import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import './navbar.css';
import { logout } from '../../config/token';
import { useHistory } from 'react-router-dom'

const NavBar = (props) => {
	const history = useHistory();

	return (
		<Nav className="justify-content-end align-items-center NavBar" style={{height: '75px'}}>
			<Nav.Item className="ml-4 mr-auto">
				{/* <img src={ Logo } alt="" style={{width:"17vw"}}/> */}
			</Nav.Item>
			{props.auth ?
				<>
					<Nav.Item>
						<Link className={`superCenter text-center nav-link ${history.location.pathname === "/" ? 'active' : ''}`} to="/" style={{height: '75px'}}>Dashboard</Link>
					</Nav.Item>
					<Nav.Item>
						<Link className={`superCenter text-center nav-link ${history.location.pathname === "/profile" ? 'active' : ''}`} to="/profile" style={{height: '75px'}}>Profile</Link>
					</Nav.Item>

					<Link to='/login' className="btn mx-3 nav-button" onClick={logout}>
						Log out
					</Link>
				</>
				:
				<>
					<Nav.Item>
						<Link className={`superCenter text-center nav-link ${history.location.pathname === "/register" ? 'active' : ''}`} to="/register" style={{height: '75px'}}>Register</Link>
					</Nav.Item>
					<Link to='/login' className="btn mx-3 nav-button">
						Log in
					</Link>
				</>
			}
		</Nav>  
	)
}

export default NavBar;