import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import ProfileLogic from './ProfileLogic';
import './profile.css';

const Profile = () => {

  const {
    loading,
    email,
    name,
    since,
    active,
  } = ProfileLogic();

  return (
    <>
      <div className="profile-main">
        <div className="profile-contenedor">
          <div className="row mx-0 px-0" style={{marginTop: '20vh'}}>
            <form className="border-shadow profile-form">
              {loading ? 
                <div className="superCenter">
                  <Spinner animation="border" size='sm'/>
                </div>
                :
                <>
                  <p className="profile-data">Nombre:</p>
                  <input disabled value={name} className="mx-auto w-75 my-2 form-input form-control" type='name' name="name" placeholder="Nombre"/>
                  <p className="profile-data">Email:</p>
                  <input disabled value={email} className="mx-auto w-75 my-2 form-input form-control" type='email' name="email" placeholder="E-mail"/>
                  <p className="profile-data">Usuario desde:</p>
                  <input disabled value={`${since.toDateString()} ${since.toLocaleTimeString()}`} className="mx-auto w-75 my-2 form-input form-control" type='email' name="email" placeholder="E-mail"/>
                  <p className="profile-data">Activo:</p>
                  <input disabled value={active ? "Activo" : "Inactivo"} className="mx-auto w-75 my-2 form-input form-control" type='email' name="email" placeholder="E-mail"/>
                </>
              }
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;