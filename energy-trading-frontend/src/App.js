

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ENERGY_TRADING_ABI, ENERGY_TRADING_ADDRESS, ENERGY_TOKEN_ABI, ENERGY_TOKEN_ADDRESS } from "./config.js";

const EnergyTradingApp = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [bidIndex, setBidIndex] = useState("");
  const [sellOrders, setSellOrders] = useState([]);
  const [orderBids, setOrderBids] = useState([]);

  // Connect to wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setWalletAddress(await signer.getAddress());
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Initialize contracts
  const getEnergyTradingContract = () => {
    if (!window.ethereum) throw new Error("Ethereum wallet not detected");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(ENERGY_TRADING_ADDRESS, ENERGY_TRADING_ABI, signer);
  };

  const getEnergyTokenContract = () => {
    if (!window.ethereum) throw new Error("Ethereum wallet not detected");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(ENERGY_TOKEN_ADDRESS, ENERGY_TOKEN_ABI, signer);
  };

  // Create a sell order
  const createSellOrder = async () => {
    const contract = getEnergyTradingContract();
    try {
      const amountInWei = ethers.utils.parseUnits(amount, 18);
      const minPriceInWei = ethers.utils.parseUnits(minPrice, 18);
      const maxPriceInWei = ethers.utils.parseUnits(maxPrice, 18);

      const tx = await contract.createSellOrder(amountInWei, minPriceInWei, maxPriceInWei, duration);
      await tx.wait();
      alert("Sell order created successfully!");
    } catch (error) {
      console.error("Error creating sell order:", error);
      alert("Error creating sell order");
    }
  };

  // Approve tokens for bidding
  const approveTokens = async () => {
    const energyToken = getEnergyTokenContract();
    try {
      const tx = await energyToken.approve(ENERGY_TRADING_ADDRESS, ethers.utils.parseUnits(bidAmount, 18));
      await tx.wait();
      alert("Approval successful! You can now place your bid.");
    } catch (error) {
      console.error("Error approving tokens:", error);
      alert("Token approval failed!");
    }
  };

  // Place a bid on an order
  const placeBid = async () => {
    const contract = getEnergyTradingContract();
    try {
      await approveTokens(); // Approve tokens first

      const bidAmountInWei = ethers.utils.parseUnits(bidAmount, 18);

      const tx = await contract.placeBid(orderId, bidAmountInWei);
      await tx.wait();

      alert("Bid placed successfully!");
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Error placing bid");
    }
  };

  // Handle placing a bid (approval + bid)
  const handlePlaceBid = async () => {
    try {
      await approveTokens(); // Approve tokens first
      await placeBid(); // Then place the bid
    } catch (error) {
      console.error("Error during bid process:", error);
    }
  };

  // Fetch all sell orders
  const fetchSellOrders = async () => {
    const contract = getEnergyTradingContract();
    try {
      const orders = await contract.getSellOrders();
      setSellOrders(
        orders.map((order, index) => ({
          id: index,
          seller: order.seller,
          amount: ethers.utils.formatUnits(order.amount, 18),
          minPrice: ethers.utils.formatUnits(order.minPrice, 18),
          maxPrice: ethers.utils.formatUnits(order.maxPrice, 18),
          expiration: order.expiration.toString(),
          active: order.active,
        }))
      );
    } catch (error) {
      console.error("Error fetching sell orders:", error);
    }
  };

  useEffect(() => {
    fetchSellOrders();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Energy Trading DApp</h1>
      <button
        onClick={connectWallet}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>

      {/* Create Sell Order */}
      <div>
        <h2 className="text-xl font-semibold mt-4">Create Sell Order</h2>
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Duration (seconds)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 mb-2"
        />
        <button
          onClick={createSellOrder}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Create Order
        </button>
      </div>

      {/* Place a Bid */}
      <div>
        <h2 className="text-xl font-semibold mt-4">Place a Bid</h2>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Bid Amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="border p-2 mb-2"
        />
        <button
          onClick={handlePlaceBid}
          className="bg-yellow-500 text-white py-2 px-4 rounded"
        >
          Approve & Place Bid
        </button>
      </div>

      {/* Display All Sell Orders */}
      <div>
        <h2 className="text-xl font-semibold mt-4">All Sell Orders</h2>
        {sellOrders.map((order) => (
          <div key={order.id} className="border p-2 mb-2">
            <p>Order ID: {order.id}</p>
            <p>Seller: {order.seller}</p>
            <p>Amount: {order.amount} tokens</p>
            <p>Min Price: {order.minPrice} tokens</p>
            <p>Max Price: {order.maxPrice} tokens</p>
            <p>Expiration: {order.expiration}</p>
            <p>Status: {order.active ? "Active" : "Inactive"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnergyTradingApp;

//1 
// import React, { useState } from "react";
// import { ethers } from "ethers";
// import { ENERGY_TRADING_ABI, ENERGY_TRADING_ADDRESS } from "./config.js";

// const EnergyTradingApp = () => {
//   const [walletAddress, setWalletAddress] = useState(null);
//   const [orderId, setOrderId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [duration, setDuration] = useState("");
//   const [bidAmount, setBidAmount] = useState("");
//   const [bidIndex, setBidIndex] = useState("");

//   // Connect to wallet
//   const connectWallet = async () => {
//     if (window.ethereum) {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = provider.getSigner();
//       setWalletAddress(await signer.getAddress());

//       // Start listening to contract events(done by shyam at 27jan 1:40am)
//     listenToEvents();
//      // done by shyam at 27jan 1:40am
//     } else {
//       alert("Please install MetaMask!");
//     }
//   };

//   // Initialize contract
//   const getContract = () => {
//     if (!window.ethereum) throw new Error("Ethereum wallet not detected");
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     return new ethers.Contract(ENERGY_TRADING_ADDRESS, ENERGY_TRADING_ABI, signer);
//   };

//   // Listen to contract events and alert based on them
//   const listenToEvents = () => {
//     const contract = getContract();

//     contract.on("SellOrderCreated", (orderId, seller, amount, minPrice, maxPrice, expiration) => {
//       alert(`Sell Order Created: Order ID: ${orderId}, Seller: ${seller}, Amount: ${amount}, Min Price: ${minPrice}, Max Price: ${maxPrice}, Expiration: ${expiration}`);
//     });

//     contract.on("BidPlaced", (orderId, buyer, price) => {
//       alert(`Bid Placed: Order ID: ${orderId}, Buyer: ${buyer}, Price: ${price}`);
//     });

//     contract.on("OrderExecuted", (orderId, buyer, amount, price) => {
//       alert(`Order Executed: Order ID: ${orderId}, Buyer: ${buyer}, Amount: ${amount}, Price: ${price}`);
//     });

//     contract.on("OrderCancelled", (orderId) => {
//       alert(`Order Cancelled: Order ID: ${orderId}`);
//     });

//     contract.on("BidRefunded", (orderId, buyer, amount) => {
//       alert(`Bid Refunded: Order ID: ${orderId}, Buyer: ${buyer}, Amount: ${amount}`);
//     });

//     contract.on("Debug", (message, value) => {
//       console.log(message, value);
//     });
//   };

//   // Create a sell order
//   const createSellOrder = async () => {
//     const contract = getContract();
//     try {
//       const tx = await contract.createSellOrder(amount, minPrice, maxPrice, duration);
//       await tx.wait();
//       alert("Sell order created successfully!");
      
//     } catch (error) {
//       console.error(error);
//       alert("Error creating sell order");
//     }
//   };

//   // Cancel a sell order
//   const cancelSellOrder = async () => {
//     const contract = getContract();
//     try {
//       const tx = await contract.cancelSellOrder(orderId);
//       await tx.wait();
//       alert("Sell order cancelled successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Error cancelling sell order");
//     }
//   };

//   // Place a bid on an order
//   const placeBid = async () => {
//     const contract = getContract();
//     try {
//       const tx = await contract.placeBid(orderId, bidAmount);
//       await tx.wait();
//       alert("Bid placed successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Error placing bid");
//     }
//   };

//   // Accept a bid
//   const acceptBid = async () => {
//     const contract = getContract();
//     try {
//       const tx = await contract.acceptBid(orderId, bidIndex);
//       await tx.wait();
//       alert("Bid accepted successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Error accepting bid");
//     }
//   };

//   // Withdraw an expired bid
//   const withdrawExpiredBid = async () => {
//     const contract = getContract();
//     try {
//       const tx = await contract.withdrawExpiredBid(orderId, bidIndex);
//       await tx.wait();
//       alert("Expired bid withdrawn successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Error withdrawing expired bid");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Energy Trading DApp</h1>
//       <button
//         onClick={connectWallet}
//         className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
//       >
//         {walletAddress ? "Wallet Connected" : "Connect Wallet"}
//       </button>
//       <div>
//         <h2 className="text-xl font-semibold mt-4">Create Sell Order</h2>
//         <input
//           type="text"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Min Price"
//           value={minPrice}
//           onChange={(e) => setMinPrice(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Max Price"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Duration"
//           value={duration}
//           onChange={(e) => setDuration(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <button
//           onClick={createSellOrder}
//           className="bg-green-500 text-white py-2 px-4 rounded"
//         >
//           Create Order
//         </button>
//       </div>
//       <div>
//         <h2 className="text-xl font-semibold mt-4">Cancel Sell Order</h2>
//         <input
//           type="text"
//           placeholder="Order ID"
//           value={orderId}
//           onChange={(e) => setOrderId(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <button
//           onClick={cancelSellOrder}
//           className="bg-red-500 text-white py-2 px-4 rounded"
//         >
//           Cancel Order
//         </button>
//       </div>
//       <div>
//         <h2 className="text-xl font-semibold mt-4">Place a Bid</h2>
//         <input
//           type="text"
//           placeholder="Order ID"
//           value={orderId}
//           onChange={(e) => setOrderId(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Bid Amount"
//           value={bidAmount}
//           onChange={(e) => setBidAmount(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <button
//           onClick={placeBid}
//           className="bg-yellow-500 text-white py-2 px-4 rounded"
//         >
//           Place Bid
//         </button>
//       </div>
//       <div>
//         <h2 className="text-xl font-semibold mt-4">Accept a Bid</h2>
//         <input
//           type="text"
//           placeholder="Order ID"
//           value={orderId}
//           onChange={(e) => setOrderId(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Bid Index"
//           value={bidIndex}
//           onChange={(e) => setBidIndex(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <button
//           onClick={acceptBid}
//           className="bg-purple-500 text-white py-2 px-4 rounded"
//         >
//           Accept Bid
//         </button>
//       </div>
//       <div>
//         <h2 className="text-xl font-semibold mt-4">Withdraw Expired Bid</h2>
//         <input
//           type="text"
//           placeholder="Order ID"
//           value={orderId}
//           onChange={(e) => setOrderId(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Bid Index"
//           value={bidIndex}
//           onChange={(e) => setBidIndex(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <button
//           onClick={withdrawExpiredBid}
//           className="bg-gray-500 text-white py-2 px-4 rounded"
//         >
//           Withdraw Expired Bid
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EnergyTradingApp;
// ye hai old one 


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React, { useState } from "react";
// import { ethers } from "ethers";
// import { ENERGY_TRADING_ABI, ENERGY_TRADING_ADDRESS, ENERGY_TOKEN_ABI, ENERGY_TOKEN_ADDRESS } from "./config.js";

// const EnergyTradingApp = () => {
//   const [walletAddress, setWalletAddress] = useState(null);
//   const [orderId, setOrderId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [duration, setDuration] = useState("");
//   const [bidAmount, setBidAmount] = useState("");
//   const [bidIndex, setBidIndex] = useState("");

//   // Connect to wallet
//   const connectWallet = async () => {
//     if (window.ethereum) {
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = provider.getSigner();
//       setWalletAddress(await signer.getAddress());

//       // Start listening to contract events
//       listenToEvents();
//     } else {
//       alert("Please install MetaMask!");
//     }
//   };

//   // Initialize contracts
//   const getEnergyTradingContract = () => {
//     if (!window.ethereum) throw new Error("Ethereum wallet not detected");
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     return new ethers.Contract(ENERGY_TRADING_ADDRESS, ENERGY_TRADING_ABI, signer);
//   };

//   const getEnergyTokenContract = () => {
//     if (!window.ethereum) throw new Error("Ethereum wallet not detected");
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     return new ethers.Contract(ENERGY_TOKEN_ADDRESS, ENERGY_TOKEN_ABI, signer);
//   };

//   // Listen to contract events
//   const listenToEvents = () => {
//     const contract = getEnergyTradingContract();
  
//     contract.on("SellOrderCreated", (orderId, seller, amount, minPrice, maxPrice, expiration) => {
//       alert(`Sell Order Created:
//         Order ID: ${orderId}
//         Seller: ${seller}
//         Amount: ${ethers.utils.formatUnits(amount, 18)} tokens
//         Min Price: ${ethers.utils.formatUnits(minPrice, 18)} tokens
//         Max Price: ${ethers.utils.formatUnits(maxPrice, 18)} tokens
//         Expiration: ${expiration} seconds
//       `);
//     });
  
//     contract.on("BidPlaced", (orderId, buyer, price) => {
//       alert(`Bid Placed:
//         Order ID: ${orderId}
//         Buyer: ${buyer}
//         Price: ${ethers.utils.formatUnits(price, 18)} tokens
//       `);
//     });
  
//     contract.on("OrderExecuted", (orderId, buyer, amount, price) => {
//       alert(`Order Executed:
//         Order ID: ${orderId}
//         Buyer: ${buyer}
//         Amount: ${ethers.utils.formatUnits(amount, 18)} tokens
//         Price: ${ethers.utils.formatUnits(price, 18)} tokens
//       `);
//     });
  
//     contract.on("OrderCancelled", (orderId) => {
//       alert(`Order Cancelled: Order ID: ${orderId}`);
//     });
  
//     contract.on("BidRefunded", (orderId, buyer, amount) => {
//       alert(`Bid Refunded:
//         Order ID: ${orderId}
//         Buyer: ${buyer}
//         Amount: ${ethers.utils.formatUnits(amount, 18)} tokens
//       `);
//     });
//   };
  

//   // Create a sell order
//   const createSellOrder = async () => {
//     const contract = getEnergyTradingContract();
//     try {
//       // Convert values to smallest units (wei)
//       const amountInWei = ethers.utils.parseUnits(amount, 18);
//       const minPriceInWei = ethers.utils.parseUnits(minPrice, 18);
//       const maxPriceInWei = ethers.utils.parseUnits(maxPrice, 18);

//       const tx = await contract.createSellOrder(amountInWei, minPriceInWei, maxPriceInWei, duration);
//       await tx.wait();
//       alert("Sell order created successfully!");
//     } catch (error) {
//       console.error("Error creating sell order:", error);
//       alert("Error creating sell order");
//     }
//   };

//   // Approve tokens for bidding
//   const approveTokens = async () => {
//     const energyToken = getEnergyTokenContract();
//     try {
//       const tx = await energyToken.approve(ENERGY_TRADING_ADDRESS, ethers.utils.parseUnits(bidAmount, 18));
//       await tx.wait();
//       alert("Approval successful! You can now place your bid.");
//     } catch (error) {
//       console.error("Error approving tokens:", error);
//       alert("Token approval failed!");
//     }
//   };

//   // Place a bid on an order
//   const placeBid = async () => {
//     const contract = getEnergyTradingContract();
//     try {
//       // await approveTokens();
//       const bidAmountInWei = ethers.utils.parseUnits(bidAmount, 18);
//       const tx = await contract.placeBid(orderId, bidAmountInWei);
//       await tx.wait();
//       alert("Bid placed successfully!");
//     } catch (error) {
//       console.error("Error placing bid:", error);
//       alert("Error placing bid");
//     }
//   };

//   // Handle placing a bid (with approval step)
//   const handlePlaceBid = async () => {
//     try {
//       // Step 1: Approve tokens
//       await approveTokens();

//       // Step 2: Place the bid
//       await placeBid();
//     } catch (error) {
//       console.error("Error during bid process:", error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Energy Trading DApp</h1>
//       <button
//         onClick={connectWallet}
//         className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
//       >
//         {walletAddress ? "Wallet Connected" : "Connect Wallet"}
//       </button>

//       {/* Create Sell Order */}
//       <div>
//         <h2 className="text-xl font-semibold mt-4">Create Sell Order</h2>
//         <input
//           type="text"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Min Price"
//           value={minPrice}
//           onChange={(e) => setMinPrice(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Max Price"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Duration (seconds)"
//           value={duration}
//           onChange={(e) => setDuration(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <button
//           onClick={createSellOrder}
//           className="bg-green-500 text-white py-2 px-4 rounded"
//         >
//           Create Order
//         </button>
//       </div>

//       {/* Place a Bid */}
//       <div>
//         <h2 className="text-xl font-semibold mt-4">Place a Bid</h2>
//         <input
//           type="text"
//           placeholder="Order ID"
//           value={orderId}
//           onChange={(e) => setOrderId(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Bid Amount"
//           value={bidAmount}
//           onChange={(e) => setBidAmount(e.target.value)}
//           className="border p-2 mb-2"
//         />
//         <button
//           onClick={handlePlaceBid}
//           className="bg-yellow-500 text-white py-2 px-4 rounded"
//         >
//           Approve & Place Bid
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EnergyTradingApp;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
