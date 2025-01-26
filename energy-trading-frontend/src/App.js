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


import React, { useState } from "react";
import { ethers } from "ethers";
import { ENERGY_TRADING_ABI, ENERGY_TRADING_ADDRESS } from "./config.js";

const EnergyTradingApp = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [bidIndex, setBidIndex] = useState("");

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

  // Initialize contract
  const getContract = () => {
    if (!window.ethereum) throw new Error("Ethereum wallet not detected");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(ENERGY_TRADING_ADDRESS, ENERGY_TRADING_ABI, signer);
  };

  // Listen to contract events and alert based on them
  const listenToEvents = () => {
    const contract = getContract();

    contract.on("SellOrderCreated", (orderId, seller, amount, minPrice, maxPrice, expiration) => {
      alert(`Sell Order Created: Order ID: ${orderId}, Seller: ${seller}, Amount: ${amount}, Min Price: ${minPrice}, Max Price: ${maxPrice}, Expiration: ${expiration}`);
    });

    contract.on("BidPlaced", (orderId, buyer, price) => {
      alert(`Bid Placed: Order ID: ${orderId}, Buyer: ${buyer}, Price: ${price}`);
    });

    contract.on("OrderExecuted", (orderId, buyer, amount, price) => {
      alert(`Order Executed: Order ID: ${orderId}, Buyer: ${buyer}, Amount: ${amount}, Price: ${price}`);
    });

    contract.on("OrderCancelled", (orderId) => {
      alert(`Order Cancelled: Order ID: ${orderId}`);
    });

    contract.on("BidRefunded", (orderId, buyer, amount) => {
      alert(`Bid Refunded: Order ID: ${orderId}, Buyer: ${buyer}, Amount: ${amount}`);
    });

    contract.on("Debug", (message, value) => {
      console.log(message, value);
    });
  };

  // Create a sell order
  const createSellOrder = async () => {
    const contract = getContract();
    try {
      const tx = await contract.createSellOrder(amount, minPrice, maxPrice, duration);
      await tx.wait();
      alert("Sell order created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating sell order");
    }
  };

  // Cancel a sell order
  const cancelSellOrder = async () => {
    const contract = getContract();
    try {
      const tx = await contract.cancelSellOrder(orderId);
      await tx.wait();
      alert("Sell order cancelled successfully!");
    } catch (error) {
      console.error(error);
      alert("Error cancelling sell order");
    }
  };

  // Place a bid on an order
  const placeBid = async () => {
    const contract = getContract();
    try {
      const tx = await contract.placeBid(orderId, bidAmount);
      await tx.wait();
      alert("Bid placed successfully!");
    } catch (error) {
      console.error(error);
      alert("Error placing bid");
    }
  };

  // Accept a bid
  const acceptBid = async () => {
    const contract = getContract();
    try {
      const tx = await contract.acceptBid(orderId, bidIndex);
      await tx.wait();
      alert("Bid accepted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error accepting bid");
    }
  };

  // Withdraw an expired bid
  const withdrawExpiredBid = async () => {
    const contract = getContract();
    try {
      const tx = await contract.withdrawExpiredBid(orderId, bidIndex);
      await tx.wait();
      alert("Expired bid withdrawn successfully!");
    } catch (error) {
      console.error(error);
      alert("Error withdrawing expired bid");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Energy Trading DApp</h1>
      <button
        onClick={connectWallet}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        {walletAddress ? "Wallet Connected" : "Connect Wallet"}
      </button>
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
          placeholder="Duration"
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
      <div>
        <h2 className="text-xl font-semibold mt-4">Cancel Sell Order</h2>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border p-2 mb-2"
        />
        <button
          onClick={cancelSellOrder}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Cancel Order
        </button>
      </div>
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
          onClick={placeBid}
          className="bg-yellow-500 text-white py-2 px-4 rounded"
        >
          Place Bid
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mt-4">Accept a Bid</h2>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Bid Index"
          value={bidIndex}
          onChange={(e) => setBidIndex(e.target.value)}
          className="border p-2 mb-2"
        />
        <button
          onClick={acceptBid}
          className="bg-purple-500 text-white py-2 px-4 rounded"
        >
          Accept Bid
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mt-4">Withdraw Expired Bid</h2>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Bid Index"
          value={bidIndex}
          onChange={(e) => setBidIndex(e.target.value)}
          className="border p-2 mb-2"
        />
        <button
          onClick={withdrawExpiredBid}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Withdraw Expired Bid
        </button>
      </div>
    </div>
  );
};

export default EnergyTradingApp;
