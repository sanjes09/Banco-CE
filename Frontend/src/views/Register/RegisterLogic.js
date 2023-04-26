import {useState} from 'react';
import Axios from 'axios';
import toastr from 'toastr';
import { useHistory } from 'react-router-dom'

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/
const passRegexp = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/

const RegisterLogic = () => {
  const history = useHistory();

  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rpassword, setRpassword] = useState("")
  
  const [code, setCode] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    let error = false;
    setLoadingSubmit(true)

    if(name === '' || email === '' || password === '' || rpassword === ''){
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

    if(password !== rpassword){
      toastr.remove()
      toastr.warning("Contraseñas no coinciden");
      setLoadingSubmit(false)
      error = true;
    }

    if(!password.match(passRegexp)){
      toastr.remove()
      toastr.warning("La contraseña debe tener de 8-16 caracteres, con mayuscula, minuscula y numeros");
      setLoadingSubmit(false)
      error = true;
    }

    if(!error){
      const data = {
        name: name,
        email: email,
        password: password,
      }
      Axios.post("/api/signup", data).then(response => {
        if(response.data.ok){
          setLoadingSubmit(false)
          toastr.success('Cuenta creada!')
          setTimeout(() => {
            history.push({
              pathname: "/confirm-code",
              state: { email: email }
            })
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
  
  const handleSubmitCode = (e) => {
    e.preventDefault();
    let error = false;
    setLoadingSubmit(true)

    if(code === ''){
      toastr.remove()
      toastr.warning("Complete todos los campos");
      setLoadingSubmit(false)
      error = true;
    }

    if(!error){
      const data = {
        token: code,
        email: email,
      }
      Axios.post("/api/confirm-account", data).then(response => {
        if(response.data.ok){
          setLoadingSubmit(false)
          toastr.success('Cuenta verificada!')
          setTimeout(() => {
            history.push("/login")
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
  
  const handleSubmitResendCode = (e) => {
    e.preventDefault();
    let error = false;
    setLoadingSubmit(true)

    if(email === ''){
      toastr.remove()
      toastr.warning("Complete todos los campos");
      setLoadingSubmit(false)
      error = true;
    }

    if(!error){
      const data = {
        email: email,
      }
      Axios.post("/api/resend-code", data).then(response => {
        if(response.data.ok){
          setLoadingSubmit(false)
          toastr.success('Codigo enviado!')
          setTimeout(() => {
            history.push({
              pathname: "/confirm-code",
              state: { email: email }
            })
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
    setLoadingSubmit,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    rpassword,
    setRpassword,
    handleSubmit,
    code,
    setCode,
    handleSubmitCode,
    handleSubmitResendCode
  };
}

export default RegisterLogic;