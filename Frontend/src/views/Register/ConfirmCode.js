import React, { useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';
import RegisterLogic from './RegisterLogic';
import './register.css';
import { useLocation } from "react-router-dom";

const ConfirmCode = () => {

  const location = useLocation();

  const {
    loadingSubmit,
    setCode,
    handleSubmitCode,
    setEmail
  } = RegisterLogic();

  useEffect(() => {
    setEmail(location.state.email)
  }, [location.state.email, setEmail])

  return (
    <>
      <div className="register-main">
        <div className="register-contenedor">
          <div className="row px-0 mx-0" style={{marginTop: '20vh'}}>
            <form className="border-shadow register-form" style={{width: '50%', marginLeft:'auto', marginRight: 'auto'}} onSubmit={handleSubmitCode}>
              <div className="row my-3">
                <input onChange={e=>setCode(e.target.value)} className="mx-auto w-75 my-2 form-input form-control" type="text" name="code" placeholder="Codigo"/>
              </div>
              <div className="row my-2">
                <button className="col-4 btn btn-md mx-auto register-button" type="submit">
                  {loadingSubmit ? 
                    <Spinner animation="border" size='sm'/>
                  : 
                    'Confirmar'
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

export default ConfirmCode;