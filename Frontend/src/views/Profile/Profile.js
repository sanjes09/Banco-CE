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
    juridico,
    showJuridico,
    setShowJuridico,
    activateOrDisplayBusiness,
    token,
    txs,
    user,
    generateTDC,
    generateAddress
  } = ProfileLogic();

  return (
    <>
      <div className="profile-main">
        <div className="profile-contenedor">
          <div className="row mx-0 px-0" style={{marginTop: '20vh'}}>
            <div className="border-shadow profile-data-info">
              {showJuridico?
                <div className="profile-table-info">
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
                </div>
              :
              <div className="profile-personal-info">
                <div className="info-card">
                  {user.creditCard === 0 ? 
                    <div className="profile-buttons">
                      <button className="col-4 btn btn-sm mx-auto profile-button" onClick={()=>generateTDC()}>
                        Generar tarjeta de credito
                      </button>
                    </div>
                    :
                    <>
                      <h4 className="titulo">Tarjeta de credito</h4>
                      <p className="profile-data">Numero:</p>
                      <input disabled value={user.creditCard} className="mx-auto w-75 my-2 form-input form-control" placeholder="Numero"/>
                      <p className="profile-data">Fecha de expiracion:</p>
                      <input disabled value={user.expirationDate} className="mx-auto w-75 my-2 form-input form-control" placeholder="Fecha de expiracion"/>
                      <p className="profile-data">CVV:</p>
                      <input disabled value={user.cvv} className="mx-auto w-75 my-2 form-input form-control" placeholder="CVV"/>
                    </>
                  }
                </div>

                <div className="info-card">
                  {user.address === "" ? 
                    <div className="profile-buttons">
                      <button className="col-4 btn btn-sm mx-auto profile-button" onClick={generateAddress}>
                        Generar cuenta en criptomoneda
                      </button>
                    </div>
                    :
                    <>
                      <h4 className="titulo">Criptomonedas</h4>
                      <p className="profile-data">Address:</p>
                      <input disabled value={user.address} className="mx-auto w-75 my-2 form-input form-control" placeholder="Address"/>
                      <p className="profile-data">Llave privada:</p>
                      <input disabled value={user.privKey} className="mx-auto w-75 my-2 form-input form-control" placeholder="Llave privada"/>
                      <p className="profile-data">mnemonic:</p>
                      <p className="mx-auto w-75 my-2">{user.mnemonic}</p>
                    </>
                  }
                </div>
              </div>
              }
            </div>
            <div className="border-shadow profile-form">
              {loading ? 
                <div className="superCenter">
                  <Spinner animation="border" size='sm'/>
                </div>
                :
                showJuridico?
                  <>
                    <div className="profile-buttons">
                      <button className="col-4 btn btn-sm mx-auto profile-button" onClick={()=>setShowJuridico(false)}>
                        Perfil personal
                      </button>
                    </div>
                    <p className="profile-data">API Token:</p>
                    <input disabled value={token} className="mx-auto w-75 my-2 form-input form-control" placeholder="Token"/>
                  </>
                :
                  <>
                    <div className="profile-buttons">
                      <button className="col-4 btn btn-sm mx-auto profile-button" onClick={activateOrDisplayBusiness}>
                        {juridico ? 
                          'Perfil de empresas'
                        : 
                          'Activar perfil de empresas'
                        }
                      </button>
                    </div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;