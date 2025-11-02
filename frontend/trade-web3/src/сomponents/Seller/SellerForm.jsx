import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, fetchProducts } from "../../repositoryes/web3Repository";
import { setProducts } from "../../redux/contractSlice";

function SellerForm() {
  const dispatch = useDispatch();
  const contractAddress = useSelector((s) => s.contract.contractAddress);
  const status = useSelector((s) => s.contract.status);
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

    await addProduct(contractAddress, name, price);

    dispatch(setProducts(await fetchProducts(contractAddress)));
    setName("");
    setPrice("");
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
