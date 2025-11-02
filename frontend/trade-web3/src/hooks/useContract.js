import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchStatus } from "../repositoryes/web3Repository";
import { setProducts, setStatus } from "../redux/contractSlice";

export const useContractWatcher = () => {
  const dispatch = useDispatch();
  const contractAddress = useSelector((s) => s.contract.contractAddress);
  // const status = useSelector((s) => s.contract.status);

  useEffect(() => {
    if (!contractAddress) return;

    const tick = async () => {
      const status = await fetchStatus(contractAddress);
      dispatch(setStatus(status));
      if (status === "Ready") {
        const products = await fetchProducts(contractAddress);
        dispatch(setProducts(products));
      }
    };

    tick();
    const interval = setInterval(tick, 5000);

    return () => clearInterval(interval);
  }, [contractAddress]);
};
