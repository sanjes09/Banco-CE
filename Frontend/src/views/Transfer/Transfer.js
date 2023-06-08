import React from "react";
import TransferLogic from './TransferLogic';
import Spinner from 'react-bootstrap/Spinner';
import './transfer.css';

const Transfer = (props) => {

  const {
    setAmount,
    setAccount,
    setIsCripto,
    isCripto,
    handleForm,
    userInfo,
    loadingInfo,
    loadingTx,
    tx
  } = TransferLogic();

  return (
    <>
    <div className="transfer-main">
      <div className="transfer-contenedor">
        <div className="row mx-0 px-0" style={{marginTop: '20vh'}}>
          <div className="col-6 mx-auto border-shadow transfer-card">
            
            {loadingInfo ? 
              <div className="superCenter">
                <Spinner animation="border" size='md'/>
              </div>
            :
            <>
              {userInfo?.address !== "" && 
                <div className="superCenter">
                  <button onClick={()=>setIsCripto(true)} className={`col-3 btn btn-sm mx-auto transfer-button ${isCripto ? "transfer-button-selected" : ""}`}>Transferir criptomoneda</button>
                  <button onClick={()=>setIsCripto(false)} className={`col-3 btn btn-sm mx-auto transfer-button ${!isCripto ? "transfer-button-selected" : ""}`}>Transferir por banco</button>
                </div>
              }
              <p className="text-center my-3">Balance: {isCripto ? `${userInfo?.cryptoBalance}USDC` : `${userInfo?.balance}$`}</p>
              <form className="border-shadow transfer-form" onSubmit={handleForm}>
                <div className="row my-3">
                  <input onChange={e=>setAccount(e.target.value)} className="mx-auto w-75 my-2 form-input form-control" type='cuenta' name="cuenta" placeholder="Cuenta"/>
                  <input onChange={e=>setAmount(e.target.value)} className="mx-auto w-75 my-2 form-input form-control" type='amount' name="amount" placeholder="Monto"/>
                </div>
                <div className="row my-2">
                  <button className="col-4 btn btn-sm mx-auto transfer-button" type="submit" disabled={loadingTx}>
                    {loadingTx ? 
                      <Spinner animation="border" size='sm'/>
                    : 
                      'Transferir'
                    }
                  </button>
                </div>
              </form>
            </>
            }
            {tx && <p className="text-center"><a rel="noreferrer" href={`https://testnet.snowtrace.io/tx/${tx.hash}`} target="_blank">Ver transaccion</a></p>}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Transfer;