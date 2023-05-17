import { useEffect, useState } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import { getToken } from '../../config/token';

const HistoryLogic = () => {

  const [loadingInfo, setLoadingInfo] = useState(true)
  const [txs, setTxs] = useState([])

  useEffect(() => {
    axios.get("/api/app/get-History", {headers: {Authorization: 'Bearer ' + getToken()}})
    .then(response => {
      if(response.data.ok){
        setTxs(response.data.txs)
        setLoadingInfo(false)
      }else{
        toastr.remove()
        toastr.warning(response.data.error)
        setTxs([])
        setLoadingInfo(false)
      }
    }).catch(err=>{
      toastr.remove()
      toastr.warning(err.response.data.error)
      setTxs([])
      setLoadingInfo(false)
    });
  }, [])
  
  return {
    txs,
    loadingInfo
  };
}

export default HistoryLogic;