import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Register from "./views/Register/Register";
import ConfirmCode from "./views/Register/ConfirmCode";
import ResendCode from "./views/Register/ResendCode";
import Profile from "./views/Profile/Profile";
import Login from "./views/Login/Login";
import Dashboard from "./views/Dashboard/Dashboard";
import Spinner from 'react-bootstrap/Spinner';
import Axios from "axios";
import toastr from 'toastr';
import { getToken, logout} from './config/token';
import Layout from './components/Layout/Layout';

const Routes = () => {

  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    Axios
    .get('/api/logged', {headers: {Authorization: 'Bearer ' + getToken()}})
    .then(response => {
      if(response.data.ok){
        setLoading(false)
        setAuth(true)
      }else{
        setLoading(false)
        setAuth(false)
        toastr.remove();
        toastr.warning('Session expired!');
        setTimeout(() => {
          logout();
        }, 2000);
      }
    }).catch(err=>{
      setLoading(false)
      setAuth(false)
    })
  },[]);

  return (
    <>
      {loading ? 
        <div className="col-2 text-center mx-auto"><Spinner animation="border" className='colorSpinner'/></div>
      :
        <BrowserRouter>
          <Layout auth={auth}>
            <Switch> 
              {!auth ? <Route exact path="/confirm-code" render={() => <ConfirmCode auth={auth}/>}/> : null}
              {!auth ? <Route exact path="/resend-code" render={() => <ResendCode auth={auth}/>}/> : null}
              {!auth ? <Route exact path="/register" render={() => <Register auth={auth}/>}/> : null}
              {!auth ? <Route exact path="/login" render={() => <Login auth={auth}/>}/> : null}
              {auth ? <Route exact path="/" render={() => <Dashboard auth={auth}/>}/> : null}
              {auth ? <Route exact path="/profile" render={() => <Profile auth={auth}/>}/> : null}
              <Route exact render={() => <Login auth={auth}/>}/>
            </Switch>
          </Layout>
        </BrowserRouter>
      }
    </>
  );
}

export default Routes;