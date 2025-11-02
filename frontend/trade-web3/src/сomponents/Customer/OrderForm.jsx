import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrderedProduct, setStatus } from "../../redux/contractSlice";
import {
  createOrder,
  fetchStatus,
  getAccounts,
  isSeller,
} from "../../repositoryes/web3Repository";

export function OrderForm() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.contract.products);
  const status = useSelector((s) => s.contract.status);
  const contractAddress = useSelector((s) => s.contract.contractAddress);
  const orderedProduct = useSelector((s) => s.contract.orderedProduct);
  const [productOrderedName, setProductOrderName] = useState("");

  const searchPrice = (productName) => {
    const product = products.find((prod) => prod.product === productName);

    if (product) {
      return product.price;
    }
  };

  const sendOrderBtnHandler = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    if (!contractAddress) {
      console.log("Contract address is empty");
      return;
    }

    if (status != "Ready") {
      console.log("Incorrect contract status");
      return;
    }

    if (await isSeller(contractAddress)) {
      alert("You are seller!");
      return;
    }

    if (products.length === 0) {
      console.log("Select product");
      return;
    }

    if (!products.find((prod) => prod.product == productOrderedName)) {
      console.log("You input inccorect product name.");
      return;
    }

    const productOrderedPrice = searchPrice(productOrderedName);
    const currentAddress = (await getAccounts())[0]

    dispatch(
      setOrderedProduct({
        product: productOrderedName,
        price: productOrderedPrice,
      })
    );

    createOrder(
      contractAddress,
      currentAddress,
      orderedProduct.product
    );

    dispatch(setStatus(await fetchStatus(contractAddress)));
  };

  return (
    <>
      <input
        type="text"
        placeholder="Enter product name:"
        value={productOrderedName}
        className="mt-10"
        onChange={(e) => setProductOrderName(e.target.value)}
      />
      <button className="btn-m mt-10" onClick={sendOrderBtnHandler}>
        <p>Buy</p>
      </button>
    </>
  );
}
