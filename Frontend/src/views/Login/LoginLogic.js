import {useState} from 'react';
import Axios from 'axios';
import toastr from 'toastr';
import { useHistory } from 'react-router-dom'
import { setToken } from '../../config/token';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/

const LoginLogic = () => {
  const history = useHistory();

  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault();
    let error = false;

    setLoadingSubmit(true)

    if(email === '' || password === ''){
      toastr.remove()
      toastr.warning("Please complete all the fields");
      setLoadingSubmit(false)
      error = true;
    }

    if(email.match(emailRegexp)){
      toastr.remove()
      toastr.warning("Invalid Email");
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
          toastr.success('Logged!')
          setLoadingSubmit(false)
          setTimeout(() => {
            history.push("/dashboard")
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