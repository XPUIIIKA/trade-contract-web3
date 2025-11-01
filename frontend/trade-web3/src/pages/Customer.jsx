import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CONTRACT_ABI } from "../../config";
import {
  setContractAddress,
  setCustomer,
  setStatus,
  setProducts,
} from "../contractSlice";
import Web3 from "web3";
import ProductList from "../сomponents/ProductList";

function Customer() {
  const dispatch = useDispatch();
  const contractAddress = useSelector((s) => s.contract.address);
  const customerAccount = useSelector((s) => s.contract.customer);
  const status = useSelector((s) => s.contract.status);
  const products = useSelector((s) => s.contract.products);
  const [contractAddressInput, setContractAddressInput] = useState("");
  const [nameOrderProduct, setNameOrderProduct] = useState("");

  const renderConnectForm = () => (
    <>
      <input
        type="text"
        placeholder="Enter the contract address:"
        value={contractAddressInput}
        className="mt-10"
        onChange={(e) => setContractAddressInput(e.target.value)}
      />
      <button className="btn-xl mt-10" onClick={connectBtnHandler}>
        <p>Connect</p>
      </button>
    </>
  );

  const renderOrderForm = () => (
    <>
      <input
        type="text"
        placeholder="Enter product name:"
        value={nameOrderProduct}
        className="mt-10"
        onChange={(e) => setNameOrderProduct(e.target.value)}
      />
      <button className="btn-m mt-10" onClick={sendOrder}>
        <p>Buy</p>
      </button>
    </>
  );

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

    const customer = accounts[0];
    dispatch(setCustomer(customer));
    dispatch(setContractAddress(contractAddressInput));
  };

  const sendOrder = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    if (status != "Ready") {
      console.log("Incorrect contract status");
      return;
    }

    if (!contractAddress) {
      console.log("Contract address is empty");
      return;
    }

    if (!products) {
      console.log("Select product");
      return;
    }

    const web3 = new Web3(window.ethereum);

    const contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);

    const sellerAddress = await contract.methods.seller().call();

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const current = accounts[0];

    if (current != customerAccount) {
      dispatch(setCustomer(current));
      alert("You aren't a customer!");
      return;
    }

    if (current.toLowerCase() == sellerAddress.toLowerCase()) {
      alert("You are a seller!");
      return;
    }

    try {
      const tx = await contract.methods
        .createOrder(nameOrderProduct)
        .send({ from: customerAccount });
      console.log("Order created:", tx);
      alert("Order created");
    } catch (err) {
      console.error("Error create order:", err);
      alert("Error create order");
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
      const productsNew = JSON.parse(
        await contract.methods.getProducts().call()
      );
      // console.log(productsNew);
      dispatch(setProducts(productsNew));
    } catch (err) {
      console.error("Error getting products:", err);
      dispatch(setProducts([]));
    }
  };

  useEffect(() => {
    if (!contractAddress) return;

    const interval = setInterval(async () => {
      await getContractState();

      // Если контракт свободен — грузим продукты
      if (status === "Ready") {
        await getProducts();
      }
    }, 5000);

    // Первый запуск сразу
    getContractState().then(() => {
      if (status === "Ready") getProducts();
    });

    return () => clearInterval(interval);
  }, [contractAddress, status]);

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
      <p className={status}>Status: {status}</p>

      {/*Если contractAddress НЕ существует,отображаем форму подключения.*/}

      {!contractAddress && renderConnectForm()}

      {/*Если статус "Ready", отображаем форму покупки.*/}

      {(status === "Ready") & (products.length >= 1) ? renderOrderForm() : null}

      {/*Если статус "OrderCreated", отображаем форму ожидания.*/}

      {status === "OrderCreated" && rendrePaymentForm()}

      {products.length >= 1 && <ProductList products={products} />}
    </div>
  );
}

export default Customer;
