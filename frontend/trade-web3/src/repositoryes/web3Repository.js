import Web3 from "web3";
import { BYTECODE, CONTRACT_ABI } from "../../config";

export const getWeb3 = () => new Web3(window.ethereum);

export const isSeller = async (address) => {
  if (!address) return;

  const contract = getContract(address);
  const sellerAddress = await contract.methods.seller().call();

  const [currentAddress] = await getAccounts();
  
  return currentAddress.toLowerCase() === sellerAddress.toLowerCase();
};

export const getAccounts = async () => {
  const web3 = getWeb3();
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts;
};

export const getContract = (address) => {
  const web3 = getWeb3();
  return new web3.eth.Contract(CONTRACT_ABI, address);
};

export const fetchStatus = async (address) => {
  const contract = getContract(address);
  const status = await contract.methods.state().call();
  return ["Ready", "OrderCreated", "OrderPaid", "Shipment"][status];
};

export const fetchProducts = async (address) => {
  const contract = getContract(address);
  const json = await contract.methods.getProducts().call();
  return JSON.parse(json);
};

export const deployContract = async (deposit, account) => {
  // Создаём экземпляр контракта
  const web3 = getWeb3();
  const contract = new web3.eth.Contract(CONTRACT_ABI);

  try {
    // Отправляем транзакцию на деплой контракта
    const deployedContract = await contract
      .deploy({
        data: BYTECODE,
      })
      .send({
        from: account,
        value: web3.utils.toWei(deposit, "ether"), // страховой депозит
        gas: 4000000,
      });

    return deployedContract.options.address;
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
};

export const addProduct = async (contractAddress, name, price) => {
  const web3 = getWeb3();
  const contract = getContract(contractAddress);

  const sellerAddress = await contract.methods.seller().call();

  const [currentAddress] = await getAccounts();

  if (currentAddress.toLowerCase() !== sellerAddress.toLowerCase()) {
    alert("You aren't a seller!");
    return;
  }

  try {
    return await contract.methods
      .createProducts(name, web3.utils.toWei(price, "wei"))
      .send({ from: currentAddress, gas: 300000 });
  } catch (err) {
    console.error("Error adding product:", err);
  }
};

export const createOrder = async (address, customer, product) => {
  const contract = getContract(address);
  return await contract.methods.createOrder(product).send({ from: customer });
};

export const payOrder = async (address, customer, toPay) => {
  const web3 = getWeb3();
  const contract = await getContract(address);
  return await contract.methods.payOrder().send({ from: customer, value: web3.utils.toWei(toPay, "wei")});
}