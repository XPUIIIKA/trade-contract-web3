import SellerForm from "../сomponents/Seller/SellerForm";
import { ProductList } from "../сomponents/ProductList";
import { useSelector } from "react-redux";
import { DeployForm } from "../сomponents/Seller/DeployForm";
import { useContractWatcher } from "../hooks/useContract";

function Seller() {
  const contractAddress = useSelector((s) => s.contract.contractAddress);
  const sellerAccount = useSelector((s) => s.contract.seller);
  const status = useSelector((s) => s.contract.status);
  const products = useSelector((s) => s.contract.products);

  useContractWatcher();

  return (
    <div className="div flex-div mt-10">
      <p>
        Account addres:{" "}
        {sellerAccount ? sellerAccount : "haven't an account yet"}
      </p>
      <p>
        Contract addres:{" "}
        {contractAddress ? contractAddress : "haven't a contract yet"}
      </p>
      <p className={status}>Status: {status}</p>

      {/*Если contractAddress НЕ существует,отображаем форму подключения.*/}

      {!contractAddress && <DeployForm />}

      {/*Если статус "Ready", отображаем форму продавца.*/}

      {status === "Ready" && <SellerForm contractAddress={contractAddress} />}
      {/*Если статус "products" больше равен 1 елементу, отображаем список продуктов.*/}

      {products.length >= 1 && <ProductList products={products} />}
    </div>
  );
}

export default Seller;
