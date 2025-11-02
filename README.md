#Web3 E-Commerce Smart Contract Project

This project demonstrates the full cycle of working with Web3.

A smart contract written in Solidity implements the logic for selling a product using a security deposit.

The frontend is built on React and Redux using Web3.js and a contract access repository.

## System Features

Seller

* Connects MetaMask
* Deploys a new contract
* Makes a deposit
* Adds products
* Confirms payment

Buyer

* Connects MetaMask
* Enters the contract address
* Gets data from the blockchain
* Creates an order
* Pays for the order and after seller confirmation

## Technologies

* Solidity
* Foundry
* React
* Redux
* Web3.js
* MetaMask Provider

## Smart Contract

The contract includes

* Product Storage
* Status Machine: Ready, OrderCreated, OrderPaid, Shipment
* Product Creation
* Order Creation
* Order Payment
* Full Access Rights and Ownership Checks

## Frontend

The frontend is built around the following layers:

### Web3 Repository

Defines a unified interface from Web3

* getAccounts
* getContract
*fetchStatus
*fetchProducts
* createOrder
*isSeller

###Redux

Stores data

* contractAddress
* seller
*customer
*status
*products
* orderedProduct

### useContractWatcher

The hook polls the status of the contract and goods at intervals.


## How to run locally

```bash
### Foundry Installation
curl -L https://foundry.paradigm.xyz
foundryup


###Starting a local network
anvil

###Compilation
forge build

###Launching a React application
npm install
npm run dev