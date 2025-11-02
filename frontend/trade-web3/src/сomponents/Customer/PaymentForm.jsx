import { useDispatch, useSelector } from "react-redux";
import { fetchStatus, getAccounts, isSeller, payOrder } from "../../repositoryes/web3Repository";
import { setStatus } from "../../redux/contractSlice";

export function PaymentForm() {
  const dispatch = useDispatch();
  const product = useSelector((s) => s.contract.orderedProduct);
  const status = useSelector((s) => s.contract.status);
  const contractAddress = useSelector((s) => s.contract.contractAddress);

  const payBtnHandler = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    if (!contractAddress) {
      console.log("Contract address is empty");
      return;
    }

    if (status != "OrderCreated") {
      console.log("Incorrect contract status");
      return;
    }

    if (await isSeller(contractAddress)) {
      alert("You are seller!");
      return;
    }
    const currentAddress = (await getAccounts())[0]

    await payOrder(contractAddress, currentAddress, (product.price * 2));

    dispatch(setStatus(await fetchStatus(contractAddress)));
  };

  return (
    <>
      <h2>Confirm payment</h2>
      <p>Are you sure? Do you confirm payment of {product.price * 2} wei?</p>
      <button className="btn-m mt-10" onClick={payBtnHandler}>
        <p>Pay product</p>
      </button>
    </>
  );
}
