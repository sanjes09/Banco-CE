import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import RegisterLogic from './RegisterLogic';
import './register.css';

const Register = () => {

  const {
    loadingSubmit,
    setName,
    setEmail,
    setPassword,
    setRpassword,
    handleSubmit,
  } = RegisterLogic();

  return (
    <>
      <div className="register-main">
        <div className="register-contenedor">
          <div className="row px-0 mx-0" style={{marginTop: '20vh'}}>
            <form className="border-shadow register-form" style={{width: '50%', marginLeft:'auto', marginRight: 'auto'}} onSubmit={handleSubmit}>
              <div className="row my-3">
                <input onChange={e=>setName(e.target.value)} className="mx-auto w-75 my-2 form-input form-control" type="text" name="name" placeholder="Name"/>
                <input onChange={e=>setEmail(e.target.value)} className="mx-auto w-75 my-2 form-input form-control" type="text" name="email" placeholder="E-mail"/>
                <input onChange={e=>setPassword(e.target.value)} className="mx-auto w-75 my-2 form-input form-control" type="password" name="password" placeholder="Password"/>
                <input onChange={e=>setRpassword(e.target.value)} className="mx-auto w-75 my-2 form-input form-control" type="password" name="rpassword" placeholder="Verify Password"/>
              </div>
              <div className="row my-2">
                <button className="col-4 btn btn-md mx-auto register-button" type="submit">
                  {loadingSubmit ? 
                    <Spinner animation="border" size='sm'/>
                  : 
                    'Create Account'
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

export default Register;