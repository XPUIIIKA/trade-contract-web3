import { useDispatch, useSelector } from "react-redux";
import {
  setContractAddress,
  setCustomer,
  setProducts,
  setStatus,
} from "../../redux/contractSlice";
import { useState } from "react";
import {
  fetchProducts,
  fetchStatus,
  getAccounts,
} from "../../repositoryes/web3Repository";

export function ConnectForm() {
  const dispatch = useDispatch();
  const contractAddress = useSelector((s) => s.contract.contractAddress);
  const [inputAddress, setInputAddress] = useState("");

  const connectBtnHandler = async () => {
    if (contractAddress) return;

    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const [customer] = await getAccounts();
    dispatch(setCustomer(customer));

    dispatch(setContractAddress(inputAddress));

    const status = await fetchStatus(inputAddress);
    dispatch(setStatus(status));

    if (status === "Ready")
      dispatch(setProducts(await fetchProducts(inputAddress)));
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter the contract address:"
        value={inputAddress}
        className="mt-10"
        onChange={(e) => setInputAddress(e.target.value)}
      />
      <button className="btn-xl mt-10" onClick={connectBtnHandler}>
        <p>Connect</p>
      </button>
    </>
  );
}
