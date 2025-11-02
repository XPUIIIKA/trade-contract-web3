import { useDispatch, useSelector } from "react-redux";
import { confirmPayment, fetchStatus, getAccounts, isSeller, orderCompleted } from "../../repositoryes/web3Repository";
import { setStatus } from "../../redux/contractSlice";

export function ConfirmPayment() {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.contract.status);
  const contractAddress = useSelector((s) => s.contract.contractAddress);

  const confirmBtnHandler = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    if (!contractAddress) {
      console.log("Contract address is empty");
      return;
    }

    if (status != "OrderPaid") {
      console.log("Incorrect contract status");
      return;
    }

    if (!(await isSeller(contractAddress))) {
      alert("You aren't seller!");
      return;
    }

    const currentAddress = (await getAccounts())[0]
    await confirmPayment(contractAddress, currentAddress);
    await orderCompleted(contractAddress, currentAddress);

    dispatch(setStatus(await fetchStatus(contractAddress)));
  };
  return (
    <>
      <h2>We have a purchase</h2>
      <p>Please confirm the payment</p>
      <button className="btn-m mt-10" onClick={confirmBtnHandler}>
        <p>Сonfirm</p>
      </button>
    </>
  );
}
