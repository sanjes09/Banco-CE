import { useState } from 'react';
import Axios from 'axios';
import toastr from 'toastr';
import { setToken } from '../../config/token';

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/

const LoginLogic = () => {

  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault();
    let error = false;

    setLoadingSubmit(true)

    if(email === '' || password === ''){
      toastr.remove()
      toastr.warning("Complete todos los campos");
      setLoadingSubmit(false)
      error = true;
    }

    if(!email.match(emailRegexp)){
      toastr.remove()
      toastr.warning("Email invalido");
      setLoadingSubmit(false)
      error = true;
    }

    if(!error){
      const data = {
        email: email,
        password: password,
      }
      Axios.post("/api/login", data).then(response => {
        if(response.data.ok){
          setToken(response.data.token);
          toastr.success('Sesion iniciada!')
          setLoadingSubmit(false)
          setTimeout(() => {
            window.location = "/";
          }, 2000);
        }else{
          toastr.remove()
          toastr.warning(response.data.error)
          setLoadingSubmit(false)
        }
      }).catch(err=>{
        toastr.remove()
        toastr.warning(err.response.data.error)
        setLoadingSubmit(false)
      });
    }
  }

  return {
    loadingSubmit,
    setEmail,
    setPassword,
    handleLogin,
  };
}

export default LoginLogic;