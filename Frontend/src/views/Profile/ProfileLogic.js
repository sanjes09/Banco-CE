import { useEffect, useState } from 'react';
import Axios from 'axios';
import toastr from 'toastr';
import { getToken } from '../../config/token';

const ProfileLogic = () => {

  const [loading, setLoading] = useState(false)
  const [showJuridico, setShowJuridico] = useState(false)
  const [juridico, setJuridico] = useState(false)
  const [user, setUser] = useState({})
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [token, setToken] = useState("")
  const [since, setSince] = useState(new Date())
  const [active, setActive] = useState(false)
  const [txs, setTxs] = useState([])

  useEffect(() => {
    refreshData();
  },[]);

  const refreshData = () => {
    Axios
    .get('/api/app/currentUser', {headers: {Authorization: 'Bearer ' + getToken()}})
    .then(response => {
      if(response.data.ok){
        setUser(response.data.user)
        setEmail(response.data.user.email)
        setName(response.data.user.name)
        setSince(new Date(response.data.user.createdAt))
        setActive(response.data.user.active)
        setJuridico(response.data.user.juridico)
        setToken(response.data.user.token)
        setLoading(false)
      }else{
        toastr.warning('Error desconocido!');
        setLoading(false)
      }
    }).catch(err=>{
      console.log('err', err)
      setLoading(false)
    })

    Axios.get("/api/app/get-business-history", {headers: {Authorization: 'Bearer ' + getToken()}})
    .then(response => {
      if(response.data.ok){
        setTxs(response.data.txs)
      }else{
        toastr.remove()
        toastr.warning(response.data.error)
        setTxs([])
      }
    }).catch(err=>{
      toastr.remove()
      toastr.warning(err.response.data.error)
      setTxs([])
    });
  }
  
  const activateOrDisplayBusiness = () => {
    if(juridico){
      setShowJuridico(true)
    }else{
      Axios
      .get('/api/app/generate-business-token', {headers: {Authorization: 'Bearer ' + getToken()}})
      .then(response => {
        if(response.data.ok){
          setToken(response.data.token)
          setShowJuridico(true)
        }else{
          toastr.warning('Error desconocido!');
          setLoading(false)
        }
        refreshData()
      }).catch(err=>{
        console.log('err', err)
        setLoading(false)
      })
    }
  }
  
  const generateTDC = () => {
    Axios
    .get('/api/app/generate-tdc', {headers: {Authorization: 'Bearer ' + getToken()}})
    .then(response => {
      if(response.data.ok){
        toastr.success('Creada!');
      }else{
        toastr.warning('Error desconocido!');
      }
      refreshData()
    }).catch(err=>{
      console.log('err', err)
    })
  }
  
  const generateAddress = () => {
    Axios
    .get('/api/app/generate-wallet', {headers: {Authorization: 'Bearer ' + getToken()}})
    .then(response => {
      if(response.data.ok){
        toastr.success('Espere 10 Minutos para la activacion');
      }else{
        toastr.warning('Error desconocido!');
      }
      refreshData()
    }).catch(err=>{
      console.log('err', err)
    })
  }

  return {
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
  };
}

export default ProfileLogic;