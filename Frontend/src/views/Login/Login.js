import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import LoginLogic from './LoginLogic';
import './login.css';

const Login = () => {

  const {
    loadingSubmit,
    setEmail,
    setPassword,
    handleLogin,
  } = LoginLogic();

  return (
    <>
      <div className="login-main">
        <div className="login-contenedor">
          <div className="row mx-0 px-0" style={{marginTop: '20vh'}}>
            <form className="border-shadow login-form" onSubmit={handleLogin}>
              <div className="row my-3">
                <input onChange={e=>setEmail(e.target.value)} className="mx-auto w-75 my-2 form-input form-control" type='email' name="email" placeholder="E-mail"/>
                <input onChange={e=>setPassword(e.target.value)} className="mx-auto w-75 my-2 form-input form-control" type='password' name="password" placeholder="Contraseña"/>
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
              <div className="row mt-3">
                <a href="/forgot-password" className="mx-auto" style={{fontSize:"0.7rem", color:"#20C178"}}>Olvidaste tu contraseña?</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;