import { useEffect, useState } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import { getToken } from '../../config/token';

const TransferLogic = () => {

  const [loadingInfo, setLoadingInfo] = useState(true)
  const [loadingTx, setLoadingTx] = useState(false)
  const [isCripto, setIsCripto] = useState(true)
  const [tx, setTx] = useState("")
  const [amount, setAmount] = useState("")
  const [account, setAccount] = useState("")
  const [userInfo, setUserInfo] = useState()

  useEffect(() => {
    if(!userInfo){
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
    }
  }, [isCripto, userInfo])

  const handleForm = (e) => {
    e.preventDefault();
    setLoadingTx(true)
    const url = isCripto ? "/api/app/transfer-token" : "/api/app/transfer"
    const data = {
      amount,
      account
    }
    axios.post(url, data, {headers: {Authorization: 'Bearer ' + getToken()}})
    .then(response => {
      if(response.data.ok){
        if(isCripto){
          toastr.remove()
          toastr.success("Transaccion en proceso...")
          setTx(response.data.tx);
        }else{
          toastr.remove()
          toastr.success("Transferencia exitosa")
        }
        setLoadingInfo(false)
      }else{
        toastr.remove()
        toastr.warning(response.data.error)
        setUserInfo()
        setLoadingInfo(false)
      }
      setLoadingTx(false)
    }).catch(err=>{
      toastr.remove()
      toastr.warning(err.response.data.error)
      setUserInfo()
      setLoadingInfo(false)
      setLoadingTx(false)
    });
  }

  return {
    setAmount,
    setAccount,
    setIsCripto,
    isCripto,
    handleForm,
    userInfo,
    loadingInfo,
    loadingTx,
    tx
  };
}

export default TransferLogic;