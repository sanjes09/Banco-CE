const { ethers } = require("ethers");
const IERC20 = require("./IERC20.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC);
const mySigner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const token = new ethers.Contract(process.env.TEST_TOKEN, IERC20.abi, mySigner);

exports.initAccount = async (address, privkey) => {
  try {
    const userSigner = new ethers.Wallet(privkey, provider);
    const userToken = new ethers.Contract(process.env.TEST_TOKEN, IERC20.abi, userSigner);

    const estimatedGas = await userToken.approve.estimateGas(process.env.PUBLIC_KEY, ethers.MaxUint256);
    const {maxFeePerGas} = await provider.getFeeData();

    const fundTx= await mySigner.sendTransaction({
      to: address,
      value: (estimatedGas*maxFeePerGas).toString()
    });
    await fundTx.wait();

    const approveTx = await userToken.approve(process.env.PUBLIC_KEY, ethers.MaxUint256);
    await approveTx.wait();

    const tx = await token.transfer(address, process.env.TRANSFER_NEW_ACCOUNT);
    await tx.wait();

  } catch (error) {
    console.log('error', error)
    if(error.reason) throw error.reason
    throw error;
  }
}

exports.getAddressBalance = async (address) => {
  if(!address) return "0"
  try {
    const balance = await token.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.log('error', error)
    if(error.reason) throw error.reason
    return "0";
  }
}

exports.transferFrom = async (from, to, amount) => {
  try {
    return await token.transferFrom(from, to, amount);
  } catch (error) {
    console.log('error', error)
    if(error.reason) throw error.reason
    throw error;
  }
}