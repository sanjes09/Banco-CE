import React from "react";
import Navbar from '../NavBar/NavBar';
import './layout.css';
import { useLocation } from 'react-router-dom'
  
const Layout = ({auth, children}) => {
  const location = useLocation()
  console.log('location.pathname', location.pathname)
  return (
    <div className="main">
      <Navbar auth={auth} pathname={location.pathname}/>
      {children}
    </div>
  );
}

export default Layout;