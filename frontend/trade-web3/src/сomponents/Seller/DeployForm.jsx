import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deployContract, getAccounts } from "../../repositoryes/web3Repository";
import { setContractAddress, setSeller } from "../../redux/contractSlice";

export function DeployForm() {
  const dispatch = useDispatch();
  const contractAddress = useSelector((s) => s.contract.contractAddress);
  const [deposit, setDeposit] = useState("");

  const deployContractBtnHand = async () => {
    if (contractAddress) return;

    if (!deposit || Number(deposit) <= 0) {
      alert("Deposit is required");
      return;
    }
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const [seller] = await getAccounts();
    dispatch(setSeller(seller));

    const realContractAddress = await deployContract(deposit, seller);
    dispatch(setContractAddress(realContractAddress));
  };

  return (
    <>
      <input
        type="number"
        min="0"
        placeholder="Enter deposit (ETH):"
        value={deposit}
        className="mt-10"
        onChange={(e) => {
          setDeposit(e.target.value);
        }}
      />
      <button className="btn-xl mt-10" onClick={deployContractBtnHand}>
        <p>Start</p>
      </button>
    </>
  );
}
