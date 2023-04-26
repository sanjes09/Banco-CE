import React, {useEffect} from "react";
// import Axios from "axios";
// import toastr from 'toastr';
import Navbar from '../../components/NavBar/NavBar';
import './dashboard.css';
import DashboardLogic from './DashboardLogic';

const Dashboard = (props) => {

  const {
  } = DashboardLogic();

  useEffect(() => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    <div className="dashboard-main">
      <div className="dashboard-contenedor">
        <div className="row mx-0 px-0" style={{marginTop: '20vh'}}>
          <div className="col-6 mx-auto border-shadow dashboard-card superCenter">
            this is a protected view
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;