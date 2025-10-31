import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CONTRACT_ABI } from "../../config";
import { setContractAddress, setCustomer, setStatus } from "../contractSlice";
import Web3 from "web3";

function Customer() {
  const dispatch = useDispatch();
  const contractAddress = useSelector((s) => s.contract.address);
  const customerAccount = useSelector((s) => s.contract.customer);
  const status = useSelector((s) => s.contract.status);
  const [contractAddressInput, setContractAddressInput] = useState("");

  const connectBtnHandler = async () => {
    if (contractAddress) return;

    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    // Подключаем MetaMask
    const web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const seller = accounts[0];
    dispatch(setCustomer(seller));
    dispatch(setContractAddress(contractAddressInput));
  };

  const getContractState = async () => {
    if (!window.ethereum || !contractAddress) return;

    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);

    try {
      const stateValue = await contract.methods.state().call();
      const states = ["Ready", "OrderCreated", "OrderPaid", "Shipment"];
      dispatch(setStatus(states[stateValue]));
    } catch (err) {
      console.error("Error getting state:", err);
      dispatch(setStatus(""));
    }
  };

  useEffect(() => {
    getContractState();
    const interval = setInterval(getContractState, 5000);
    return () => clearInterval(interval);
  }, [contractAddress]);

  return (
    <div className="div flex-div mt-10">
      <p>
        Account addres:{" "}
        {customerAccount ? customerAccount : "haven't an account yet"}
      </p>
      <p>
        Contract addres:{" "}
        {contractAddress ? contractAddress : "haven't a contract yet"}
      </p>
      <p className={status}>
        Status: {status ? status : "I don't know ¯\\_(ツ)_/¯"}
      </p>
      {contractAddress ? (
        status == "Ready" ? (
          <></>
        ) : null
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter the contract address:"
            value={contractAddressInput}
            className="mt-10"
            onChange={(e) => {
              setContractAddressInput(e.target.value);
            }}
          />
          <button className="btn-xl mt-10" onClick={connectBtnHandler}>
            <p>Connect</p>
          </button>
        </>
      )}
    </div>
  );
}

export default Customer;
