import { useState } from "react";
import { CONTRACT_ABI } from "../../config";
import Web3 from "web3";

function SellerForm({ status, contractAddress, getProducts}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const priceBtnHandler = (e) => {
    e.preventDefault();

    if (e.target.value < 0) return;

    setPrice(e.target.value);
  };

  const submitBtnHandler = async (e) => {
    e.preventDefault();

    if (!window.ethereum) return;

    if (!contractAddress) return;

    if (status != "Ready") return;

    const web3 = new Web3(window.ethereum);

    const contract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);

    const sellerAddress = await contract.methods.seller().call();

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const current = accounts[0];

    if (current.toLowerCase() !== sellerAddress.toLowerCase()) {
      alert("You aren't a seller!");
      return;
    }

    try {
      const tx = await contract.methods
        .createProducts(name, web3.utils.toWei(price, "wei"))
        .send({ from: current, gas: 300000 });

      console.log("Transaction complete:", tx);
      getProducts();
      setName("");
      setPrice("");
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <div>
      <h4>Add new product</h4>
      <form className="mt-10">
        <input
          type="text"
          placeholder="Enter product name:"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        />
        <input
          type="number"
          placeholder="Enter product price:"
          onChange={priceBtnHandler}
          value={price}
          min="0"
        />
        <button className="btn-xl" onClick={submitBtnHandler}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default SellerForm;
