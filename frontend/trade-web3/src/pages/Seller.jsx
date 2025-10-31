import { useEffect, useState } from "react";
import { CONTRACT_ABI, BYTECODE } from "../../config";
import Web3 from "web3";
import SellerForm from "../сomponents/SellerForm";
import ProductList from "../сomponents/ProductList";
import { useDispatch, useSelector } from "react-redux";
import {
  setContractAddress,
  setSeller,
  setStatus,
  setProducts,
} from "../contractSlice";

function Seller() {
  const dispatch = useDispatch();
  const contractAddress = useSelector((s) => s.contract.address);
  const sellerAccount = useSelector((s) => s.contract.seller);
  const status = useSelector((s) => s.contract.status);
  const products = useSelector((s) => s.contract.products);
  const customerAccount = useSelector((s) => s.contract.customer);
  const [deposit, setDeposit] = useState("");

  const deployContract = async () => {
    if (contractAddress) return;

    if (!deposit || Number(deposit) <= 0) {
      alert("Deposit is required");
      return;
    }
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
    dispatch(setSeller(seller));

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
          value: web3.utils.toWei(deposit, "ether"), // страховой депозит
          gas: 4000000,
        });

      console.log(
        "The contract was created at the address:",
        deployedContract.options.address
      );
      dispatch(setContractAddress(deployedContract.options.address));
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
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

  const getProducts = async () => {
    if (!window.ethereum || !contractAddress) return;

    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);

    try {
      const products = JSON.parse(await contract.methods.getProducts().call());
      console.log(products);
      dispatch(setProducts(products));
    } catch (err) {
      console.error("Error getting products:", err);
      dispatch(setProducts([]));
    }
  };

  useEffect(() => {
    getContractState();
    const interval = setInterval(getContractState, 5000);
    return () => clearInterval(interval);
  }, [contractAddress]);

  if (customerAccount)
    return (
      <div className="div flex-div mt-10">
        <p>You are customer!</p>
      </div>
    );

  return (
    <div className="div flex-div mt-10">
      <p>
        Account addres:{" "}
        {sellerAccount ? sellerAccount : "haven't an account yet"}
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
          <SellerForm
            contractAddress={contractAddress}
            getProducts={getProducts}
          />
        ) : null
      ) : (
        <>
          <input
            type="number"
            min="0"
            placeholder="Enter the deposit amount:"
            value={deposit}
            className="mt-10"
            onChange={(e) => {
              setDeposit(e.target.value);
            }}
          />
          <button className="btn-xl mt-10" onClick={deployContract}>
            <p>Start</p>
          </button>
        </>
      )}
      {products.length >= 1 && <ProductList products={products} />}
    </div>
  );
}

export default Seller;
