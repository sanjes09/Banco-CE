import {useState} from 'react';
import Axios from 'axios';
import toastr from 'toastr';
import { useHistory } from 'react-router-dom'

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
const passRegexp = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/

const RegisterLogic = () => {
  const history = useHistory();

  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rpassword, setRpassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    let error = false;
    setLoadingSubmit(true)

    if(name === '' || email === '' || password === '' || rpassword === ''){
      toastr.remove()
      toastr.warning("Please complete all the fields");
      setLoadingSubmit(false)
      error = true;
    }

    if(!email.match(emailRegexp)){
      toastr.remove()
      toastr.warning("Invalid Email");
      setLoadingSubmit(false)
      error = true;
    }

    if(password !== rpassword){
      toastr.remove()
      toastr.warning("Passwords does not match");
      setLoadingSubmit(false)
      error = true;
    }

    if(!password.match(passRegexp)){
      toastr.remove()
      toastr.warning("Passwords must have 8-16 characters with an uppercase letter and a number");
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
          toastr.success('Account created!')
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
  };
}

export default RegisterLogic;