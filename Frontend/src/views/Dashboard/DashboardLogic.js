import { useEffect, useState } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import { getToken } from '../../config/token';

const DashboardLogic = () => {

  const [loadingInfo, setLoadingInfo] = useState(true)
  const [userInfo, setUserInfo] = useState()

  useEffect(() => {
    axios.get("/api/app/get-balances", {headers: {Authorization: 'Bearer ' + getToken()}})
    .then(response => {
      if(response.data.ok){
        setUserInfo({
          cryptoBalance: response.data.cryptoBalance,
          balance: response.data.balance,
          cuenta: response.data.cuenta,
          address: response.data.address
        })
        setLoadingInfo(false)
      }else{
        toastr.remove()
        toastr.warning(response.data.error)
        setUserInfo()
        setLoadingInfo(false)
      }
    }).catch(err=>{
      toastr.remove()
      toastr.warning(err.response.data.error)
      setUserInfo()
      setLoadingInfo(false)
    });
  }, [])
  
  return {
    userInfo,
    loadingInfo
  };
}

export default DashboardLogic;