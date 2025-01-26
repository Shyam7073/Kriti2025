// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EnergyTrading is ReentrancyGuard {
    uint256 public constant BIDDING_FEE_PERCENT = 5;
    uint256 public constant TRANSFER_FEE_PERCENT = 5;
    uint256 public constant GRID_COMPANY_SHARE_PERCENT = 50; 
    uint256 public constant MAX_SELL_ORDERS_PER_SELLER = 3;

    address public gridCompany;
    IERC20 public energyToken;

    struct SellOrder {
        address seller;
        uint256 amount;
        uint256 minPrice;
        uint256 maxPrice;
        uint256 expiration;
        bool active;
    }

    struct Bid {
        address buyer;
        uint256 price;
        bool refunded;
    }

    mapping(uint256 => SellOrder) public sellOrders;
    mapping(uint256 => Bid[]) public bids;
    mapping(address => uint256[]) public sellerOrders;
    mapping(address => uint256) public activeSellOrders;

    uint256 public nextOrderId;

    event SellOrderCreated(uint256 orderId, address seller, uint256 amount, uint256 minPrice, uint256 maxPrice, uint256 expiration);
    event BidPlaced(uint256 orderId, address buyer, uint256 price);
    event OrderExecuted(uint256 orderId, address buyer, uint256 amount, uint256 price);
    event OrderCancelled(uint256 orderId);
    event BidRefunded(uint256 orderId, address buyer, uint256 amount);
    event Debug(string message, uint256 value);

    constructor(address _gridCompany, address _energyToken) {
        require(_gridCompany != address(0), "Invalid grid company address");
        require(_energyToken != address(0), "Invalid token address");

        gridCompany = _gridCompany;
        energyToken = IERC20(_energyToken);
    }

    modifier onlySeller(uint256 orderId) {
        require(sellOrders[orderId].seller == msg.sender, "Not the seller");
        _;
    }

    modifier orderExists(uint256 orderId) {
        require(sellOrders[orderId].seller != address(0), "Order does not exist");
        _;
    }

    function createSellOrder(uint256 amount, uint256 minPrice, uint256 maxPrice, uint256 duration) external {
        require(activeSellOrders[msg.sender] < MAX_SELL_ORDERS_PER_SELLER, "Max sell orders reached");
        require(minPrice < maxPrice, "Min price must be less than max price");
        require(duration > 0, "Duration must be greater than 0");

        uint256 expiration = block.timestamp + duration;

        sellOrders[nextOrderId] = SellOrder({
            seller: msg.sender,
            amount: amount,
            minPrice: minPrice,
            maxPrice: maxPrice,
            expiration: expiration,
            active: true
        });

        sellerOrders[msg.sender].push(nextOrderId);
        activeSellOrders[msg.sender]++;

        emit SellOrderCreated(nextOrderId, msg.sender, amount, minPrice, maxPrice, expiration);
        nextOrderId++;
    }

    function placeBid(uint256 orderId, uint256 bidAmount) external nonReentrant orderExists(orderId) {
        SellOrder storage order = sellOrders[orderId];
        require(order.active, "Order is inactive");
        require(block.timestamp <= order.expiration, "Order expired");
        require(bidAmount >= order.minPrice && bidAmount <= order.maxPrice, "Bid not in price range");
       /* energyToken.approve(address(this), bidAmount);*/

        uint256 biddingFee = (bidAmount * BIDDING_FEE_PERCENT) / 100;
        require(bidAmount > biddingFee, "Bid too small to cover fees");

        emit Debug("Bid amount before fee", bidAmount);
        energyToken.transferFrom(msg.sender, address(this), bidAmount);

        bids[orderId].push(Bid({ buyer: msg.sender, price: bidAmount - biddingFee, refunded: false }));

        emit BidPlaced(orderId, msg.sender, bidAmount);
    }

    function acceptBid(uint256 orderId, uint256 bidIndex) external nonReentrant orderExists(orderId) onlySeller(orderId) {
        SellOrder storage order = sellOrders[orderId];
        require(order.active, "Order is inactive");
        require(bidIndex < bids[orderId].length, "Invalid bid index");
        
        Bid storage selectedBid = bids[orderId][bidIndex];
        require(!selectedBid.refunded, "Bid already processed");

        uint256 transferFee = (selectedBid.price * TRANSFER_FEE_PERCENT) / 100;
        uint256 gridCompanyShare = (transferFee * GRID_COMPANY_SHARE_PERCENT) / 100;
        uint256 sellerAmount = selectedBid.price - transferFee;

        energyToken.transfer(order.seller, sellerAmount);
        energyToken.transfer(gridCompany, gridCompanyShare);
        
        order.active = false;
        activeSellOrders[order.seller]--;
        selectedBid.refunded = true; 

        emit OrderExecuted(orderId, selectedBid.buyer, order.amount, selectedBid.price);
    }

    function cancelSellOrder(uint256 orderId) external nonReentrant orderExists(orderId) onlySeller(orderId) {
        SellOrder storage order = sellOrders[orderId];
        require(order.active, "Order already inactive");

        Bid[] storage orderBids = bids[orderId];
        for (uint256 i = 0; i < orderBids.length; i++) {
            if (!orderBids[i].refunded) {
                energyToken.transfer(orderBids[i].buyer, orderBids[i].price);
                orderBids[i].refunded = true;
            }
        }

        order.active = false;
        activeSellOrders[msg.sender]--;

        emit OrderCancelled(orderId);
    }

    function withdrawExpiredBid(uint256 orderId, uint256 bidIndex) external nonReentrant orderExists(orderId) {
        SellOrder storage order = sellOrders[orderId];
        require(block.timestamp > order.expiration, "Order not expired");

        Bid[] storage orderBids = bids[orderId];
        require(bidIndex < orderBids.length, "Invalid bid index");
        require(orderBids[bidIndex].buyer == msg.sender, "Not the buyer");
        require(!orderBids[bidIndex].refunded, "Bid already refunded");

        uint256 refundAmount = orderBids[bidIndex].price;
        orderBids[bidIndex].refunded = true;
        energyToken.transfer(msg.sender, refundAmount);

        emit BidRefunded(orderId, msg.sender, refundAmount);
    }

    function getSellOrders() external view returns (SellOrder[] memory) {
        SellOrder[] memory orders = new SellOrder[](nextOrderId);
        for (uint256 i = 0; i < nextOrderId; i++) {
            orders[i] = sellOrders[i];
        }
        return orders;
    }

    function getBids(uint256 orderId) external view orderExists(orderId) returns (Bid[] memory) {
        return bids[orderId];
    }
}