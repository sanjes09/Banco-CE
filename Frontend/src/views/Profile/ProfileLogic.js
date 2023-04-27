import { useEffect, useState } from 'react';
import Axios from 'axios';
import toastr from 'toastr';
import { getToken } from '../../config/token';

const ProfileLogic = () => {

  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [since, setSince] = useState(new Date())
  const [active, setActive] = useState(false)

  useEffect(() => {
    Axios
    .get('/api/app/currentUser', {headers: {Authorization: 'Bearer ' + getToken()}})
    .then(response => {
      if(response.data.ok){
        setEmail(response.data.user.email)
        setName(response.data.user.name)
        setSince(new Date(response.data.user.createdAt))
        setActive(response.data.user.active)
        setLoading(false)
      }else{
        toastr.warning('Error desconocido!');
        setLoading(false)
      }
    }).catch(err=>{
      console.log('err', err)
      setLoading(false)
    })
  },[]);

  return {
    loading,
    email,
    name,
    since,
    active,
  };
}

export default ProfileLogic;