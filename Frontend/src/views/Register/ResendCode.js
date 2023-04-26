import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import RegisterLogic from './RegisterLogic';
import './register.css';

const ResendCode = () => {

  const {
    loadingSubmit,
    setEmail,
    handleSubmitResendCode,
  } = RegisterLogic();

  return (
    <>
      <div className="login-main">
        <div className="login-contenedor">
          <div className="row mx-0 px-0" style={{marginTop: '20vh'}}>
            <form className="border-shadow login-form" onSubmit={handleSubmitResendCode}>
              <div className="row my-3">
                <input onChange={e=>setEmail(e.target.value)} className="mx-auto w-75 my-2 form-input form-control" type='email' name="email" placeholder="E-mail"/>
              </div>
              <div className="row my-2">
                <button className="col-4 btn btn-sm mx-auto login-button" type="submit" disabled={loadingSubmit}>
                  {loadingSubmit ? 
                    <Spinner animation="border" size='sm'/>
                  : 
                    'Enviar'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResendCode;