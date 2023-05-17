import React from "react";
import HistoryLogic from './HistoryLogic';
import Spinner from 'react-bootstrap/Spinner';
import './history.css';

const History = (props) => {

  const {
    txs,
    loadingInfo
  } = HistoryLogic();

  return (
    <>
    <div className="history-main">
      <div className="history-contenedor">
        <div className="row mx-0 px-0" style={{marginTop: '20vh'}}>
          <div className="mx-auto border-shadow history-card">
            {loadingInfo ? 
              <div className="superCenter">
                <Spinner animation="border" size='md'/>
              </div>
            :
              <table className="table">
                <thead>
                  <tr style={{borderTop: "0.2rem solid grey"}}>
                    <th scope="col" className="text-center">Cuenta</th>
                    <th scope="col" className="text-center">Para</th>
                    <th scope="col" className="text-center">Monto</th>
                    <th scope="col" className="text-center">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((arg, index) => {
                    const cuenta = arg.method === "banco" ? arg.from.cuenta : arg.from.address;
                    const para = arg.method === "banco" ? arg.to.cuenta : arg.to.address;
                    const monto = arg.method === "banco" ? `${arg.amount}$` : `${arg.amount}USDC`;
                    const fecha = new Date(arg.date);
                    const color = arg.tipo === "in" ? "green" : "red"
                    const signo = arg.tipo === "in" ? "+" : "-"
                    return (
                      <tr style={{borderTop: "0.2rem solid grey"}} key={index}>
                        <td>{cuenta}</td>
                        <td>{para}</td>
                        <td style={{color}}>{signo}{monto}</td>
                        <td>{fecha.toLocaleDateString() + " " + fecha.toLocaleTimeString()}</td>
                      </tr>
                    )
                  })}
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

export default History;