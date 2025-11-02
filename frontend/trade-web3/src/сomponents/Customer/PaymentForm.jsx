import { useSelector } from "react-redux";

export function PaymentForm() {
  const product = useSelector((s) => s.contract.orderedProduct);

  return (
    <>
      <h2>Confirm payment</h2>
      <p>Are you sure? Do you confirm payment of {product.price} wei?</p>
      <button className="btn-m mt-10">
        <p>Pay product</p>
      </button>
    </>
  );
}
