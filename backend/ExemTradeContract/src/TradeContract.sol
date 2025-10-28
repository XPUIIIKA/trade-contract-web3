// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/Strings.sol";

contract TradeContract{
    
    enum State{
        Ready,
        OrderCreated,
        OrderPaid,
        Shipment
    }

    State public state;

    mapping (string => uint256) public products;
    string[] public keys;

    string public orderItem;
    address payable public customer;
    address payable public seller;
    uint256 insurance;

    event ProductCreated(string name, uint256 price);
    event OrderCreated(address indexed customer, string product, uint256 price);
    event OrderPaid(address indexed customer, uint256 amount);
    event OrderCompleted(address indexed customer, string product, uint256 sellerAmount, uint256 refund);


    constructor() payable{
        require(msg.value > 0, "Insurance required");
        seller = payable (msg.sender);
        insurance = msg.value;
        state = State.Ready;
    } 

    function createProducts(string memory _product, uint _price) public
    onlySeller inState(State.Ready){
        require((totalCost() + _price)*2 < insurance, "Insurance is not sufficient!");
        products[_product] = _price;
        keys.push(_product);
        emit ProductCreated(_product, _price);
    }

    function totalCost() view private returns (uint256){
        uint256 total = 0;
        for(uint256 i = 0; i < keys.length; i++){
            total += products[keys[i]];
        }
        return total;
    }

    function getProducts() public view inState(State.Ready) returns (string memory) {
        string memory productList = "[";
        uint256 price;

        for (uint256 i = 0; i < keys.length; i++) {
            price = products[keys[i]];
            productList = string.concat(
                productList,
                "{ \"product\":\"", 
                keys[i], 
                "\", \"price\":", 
                Strings.toString(price), 
                "}"
            );

            if (i < keys.length - 1) {
                productList = string.concat(productList, ",");
            }
        }

        productList = string.concat(productList, "]");
        return productList;
    }

    function createOrder(string memory _productName) public inState(State.Ready) {
        require(products[_productName] > 0, "Product does not exist");
        require(msg.sender != seller, "You are seller!");
        require(bytes(_productName).length > 0, "Product name cannot be empty");
        orderItem = _productName;
        customer = payable (msg.sender);
        state = State.OrderCreated;

        emit OrderCreated(customer, orderItem, products[orderItem]);
    }

    function payOrder() public onlyCustomer payable {
        require(msg.value == products[orderItem] * 2, "Order cost is not match!");

        state = State.OrderPaid;

        emit OrderPaid(msg.sender, msg.value);
    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function confirmPayment() public onlyCustomer inState(State.OrderPaid) {
        state = State.Shipment;
    }

    function orderCompleted() public onlyCustomer inState(State.Shipment) {
        uint256 price = products[orderItem];
        require(price > 0, "Invalid product or already sold");
        require(address(this).balance >= price * 4, "Not enough balance in contract");

        seller.transfer(price * 3);

        customer.transfer(price);

        require(insurance >= price * 2, "Insurance underflow");
        insurance -= price * 2;

        emit OrderCompleted(customer, orderItem, price*3, price);

        for (uint256 i = 0; i < keys.length; i++) {
            if (keccak256(bytes(keys[i])) == keccak256(bytes(orderItem))) {
                keys[i] = keys[keys.length - 1];
                keys.pop();
                break;
            }
        }

        delete products[orderItem];
        delete orderItem;
        delete customer;

        state = State.Ready;
    }

    modifier onlySeller(){
        require(msg.sender == seller, "You are not a seller!");
        _;
    }

    modifier onlyCustomer(){
        require(msg.sender == customer, "You are not a customer!");
        _;
    }

    modifier inState (State requiredState){
        require(state == requiredState, "Wrong state!");
        _;
    }
}