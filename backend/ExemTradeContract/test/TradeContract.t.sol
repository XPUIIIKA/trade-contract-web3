// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/TradeContract.sol";

contract TradeContractTest is Test {
    TradeContract public trade;
    address payable seller = payable(address(0x1));
    address payable buyer = payable(address(0x2));
    uint256 insurance = 10 ether;

    function setUp() public {
        // Деплой контракта от seller с страховым депозитом
        vm.prank(seller);
        trade = new TradeContract{value: insurance}();
    }

    function testCreateProducts() public {
        vm.prank(seller);
        trade.createProducts("ProductA", 1 ether);

        // Проверяем, что продукт добавлен
        uint256 price = trade.products("ProductA");
        assertEq(price, 1 ether);
    }

    function testCannotCreateOrderBySeller() public {
        vm.prank(seller);
        trade.createProducts("ProductA", 1 ether);

        vm.prank(seller);
        vm.expectRevert("Seller cannot buy own product"); // если поправим require
        trade.createOrder("ProductA");
    }

    function testCreateOrder() public {
        vm.prank(seller);
        trade.createProducts("ProductA", 1 ether);

        vm.prank(buyer);
        trade.createOrder("ProductA");

        assertEq(trade.orderItem(), "ProductA");
        assertEq(trade.customer(), buyer);
        assertEq(uint(trade.state()), uint(TradeContract.State.OrderCreated));
    }

    function testPayOrderAndComplete() public {
        vm.prank(seller);
        trade.createProducts("ProductA", 1 ether);

        // Создание заказа
        vm.prank(buyer);
        trade.createOrder("ProductA");

        // Оплата
        vm.deal(buyer, 10 ether); // Устанавливаем баланс buyer
        vm.prank(buyer);
        trade.payOrder{value: 2 ether}();

        assertEq(uint(trade.state()), uint(TradeContract.State.OrderPaid));

        // Подтверждение доставки
        vm.prank(buyer);
        trade.confirmPayment();
        assertEq(uint(trade.state()), uint(TradeContract.State.Shipment));

        // Завершение заказа
        vm.prank(buyer);
        trade.orderCompleted();

        assertEq(uint(trade.state()), uint(TradeContract.State.Ready));
        assertEq(trade.products("ProductA"), 0);
    }

    function testCannotOrderNonexistentProduct() public {
        vm.prank(buyer);
        vm.expectRevert("Product does not exist");
        trade.createOrder("Nonexistent");
    }
}