import { useSelector } from "react-redux";
import { useContractWatcher } from "../hooks/useContract";
import { ProductList } from "../сomponents/ProductList";
import { OrderForm } from "../сomponents/Customer/OrderForm";
import { PaymentForm } from "../сomponents/Customer/PaymentForm";
import { ConnectForm } from "../сomponents/Customer/ConnectForm";

function Customer() {
  const contractAddress = useSelector((s) => s.contract.contractAddress);
  const customerAccount = useSelector((s) => s.contract.customer);
  const status = useSelector((s) => s.contract.status);
  const products = useSelector((s) => s.contract.products);

  const isReadyWithProducts = status === "Ready" && products.length > 0;

  useContractWatcher();

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

      {!contractAddress && <ConnectForm />}

      {/*Если статус "Ready", отображаем форму покупки.*/}

      {isReadyWithProducts ? <OrderForm /> : null}

      {/*Если статус "OrderCreated", отображаем форму ожидания.*/}

      {status === "OrderCreated" && <PaymentForm />}

      {isReadyWithProducts ? <ProductList products={products} /> : null}
    </div>
  );
}

export default Customer;
