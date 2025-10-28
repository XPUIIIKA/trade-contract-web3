import { useState } from "react";
import { CONTRACT_ABI, BYTECODE } from "../../config";
import Web3 from "web3";

function Seller() {
  const [contractAddress, setContractAddress] = useState("");
  const [account, setAccount] = useState("");


  const deployContract = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    // Подключаем MetaMask
    const web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const seller = accounts[0];
    setAccount(seller);

    // Создаём экземпляр контракта
    const contract = new web3.eth.Contract(CONTRACT_ABI);

    try {
      // Отправляем транзакцию на деплой контракта
      const deployedContract = await contract
        .deploy({
          data: BYTECODE,
        })
        .send({
          from: seller,
          value: web3.utils.toWei("0.1", "ether"), // страховой депозит
          gas: 4000000,
        });

      console.log("The contract was created at the address:", deployedContract.options.address);
      setContractAddress(deployedContract.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };


  return (
    <div className="div flex-div mt-10">
      <p>Account: {account? account : "haven't an account yet"}</p>
      <button className="btn-xl" onClick={deployContract}>
        <p>Start</p>
      </button>
    </div>
  )
}

export default Seller