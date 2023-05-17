import React from "react";
import { Link } from "react-router-dom";
import DashboardLogic from './DashboardLogic';
import Spinner from 'react-bootstrap/Spinner';
import './dashboard.css';

const Dashboard = (props) => {

  const {
    userInfo,
    loadingInfo
  } = DashboardLogic();

  return (
    <>
    <div className="dashboard-main">
      <div className="dashboard-contenedor">
        <div className="row mx-0 px-0" style={{marginTop: '20vh'}}>
          <div className="col-6 mx-auto border-shadow dashboard-card">
            {loadingInfo ? 
              <div className="superCenter">
                <Spinner animation="border" size='md'/>
              </div>
            :
              <table className="table">
                <thead>
                  <tr style={{borderTop: "0.2rem solid grey"}}>
                    <th scope="col">Cuenta</th>
                    <th scope="col">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{borderTop: "0.2rem solid grey"}}>
                    <th scope="row"><Link to="/history">{userInfo?.cuenta || "Necesita activar la cuenta"}</Link></th>
                    <td>{userInfo?.balance} $</td>
                  </tr>
                  <tr style={{borderTop: "0.2rem solid grey"}}>
                    <th scope="row"><a rel="noreferrer" target="_blank" href={`https://testnet.snowtrace.io/token/0xc50c1cbb26f87f5e62cbaa092f3028ab4377b99b?a=${userInfo?.address}`}>{userInfo?.address || "Necesita activar la cuenta"}</a></th>
                    <td>{userInfo?.cryptoBalance} USDC</td>
                  </tr>
                </tbody>
              </table>
            }
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;