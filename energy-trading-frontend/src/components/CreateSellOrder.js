import React, { useState } from 'react';
import { ethers } from 'ethers';

const ENERGY_TRADING_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_gridCompany",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_energyToken",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "BidPlaced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "BidRefunded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Debug",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderId",
          "type": "uint256"
        }
      ],
      "name": "OrderCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "OrderExecuted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "maxPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "expiration",
          "type": "uint256"
        }
      ],
      "name": "SellOrderCreated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "BIDDING_FEE_PERCENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "GRID_COMPANY_SHARE_PERCENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_SELL_ORDERS_PER_SELLER",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TRANSFER_FEE_PERCENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orderId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bidIndex",
          "type": "uint256"
        }
      ],
      "name": "acceptBid",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "activeSellOrders",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "bids",
      "outputs": [
        {
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "refunded",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orderId",
          "type": "uint256"
        }
      ],
      "name": "cancelSellOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        }
      ],
      "name": "createSellOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "energyToken",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orderId",
          "type": "uint256"
        }
      ],
      "name": "getBids",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "refunded",
              "type": "bool"
            }
          ],
          "internalType": "struct EnergyTrading.Bid[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSellOrders",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minPrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxPrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "expiration",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct EnergyTrading.SellOrder[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gridCompany",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextOrderId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orderId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bidAmount",
          "type": "uint256"
        }
      ],
      "name": "placeBid",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "sellOrders",
      "outputs": [
        {
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "expiration",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "sellerOrders",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "orderId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bidIndex",
          "type": "uint256"
        }
      ],
      "name": "withdrawExpiredBid",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const ENERGY_TRADING_ADDRESS = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';

const IERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
];

const CreateSellOrder = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState({ 
    amount: '', 
    minPrice: '', 
    maxPrice: '', 
    duration: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error('Install MetaMask');
      
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await newProvider.send("eth_requestAccounts", []);
      
      setProvider(newProvider);
      setAccount(accounts[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { amount, minPrice, maxPrice, duration } = form;
      if (!amount || !minPrice || !maxPrice || !duration) {
        throw new Error('All fields are required');
      }
      if (Number(minPrice) > Number(maxPrice)) {
        throw new Error('Minimum price must be ≤ maximum price');
      }

      const signer = await provider.getSigner();
      
      // Get energy token address
      const energyTrading = new ethers.Contract(
        ENERGY_TRADING_ADDRESS,
        ENERGY_TRADING_ABI,
        provider
      );
      const tokenAddress = await energyTrading.energyToken();

      // Check balance
      const energyToken = new ethers.Contract(tokenAddress, IERC20_ABI, signer);
      const balance = await energyToken.balanceOf(account);
      if (balance < ethers.getBigInt(amount)) {
        throw new Error('Insufficient token balance');
      }

      // Check allowance
      const allowance = await energyToken.allowance(account, ENERGY_TRADING_ADDRESS);
      if (allowance < ethers.getBigInt(amount)) {
        const approveTx = await energyToken.approve(
          ENERGY_TRADING_ADDRESS, 
          ethers.getBigInt(amount)
        );
        await approveTx.wait();
      }

      // Create sell order
      const tradingContract = new ethers.Contract(
        ENERGY_TRADING_ADDRESS,
        ENERGY_TRADING_ABI,
        signer
      );
      
      const tx = await tradingContract.createSellOrder(
        ethers.getBigInt(amount),
        ethers.getBigInt(minPrice),
        ethers.getBigInt(maxPrice),
        ethers.getBigInt(duration)
      );
      
      await tx.wait();
      
      setSuccess(true);
      setForm({ amount: '', minPrice: '', maxPrice: '', duration: '' });
    } catch (err) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div>
        <button onClick={connectWallet} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>Create Sell Order ({account.slice(0, 6)}...)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount (Tokens):</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({...form, amount: e.target.value})}
            disabled={loading}
            min="1"
          />
        </div>

        <div>
          <label>Minimum Price (Wei):</label>
          <input
            type="number"
            value={form.minPrice}
            onChange={(e) => setForm({...form, minPrice: e.target.value})}
            disabled={loading}
            min="0"
          />
        </div>

        <div>
          <label>Maximum Price (Wei):</label>
          <input
            type="number"
            value={form.maxPrice}
            onChange={(e) => setForm({...form, maxPrice: e.target.value})}
            disabled={loading}
            min="0"
          />
        </div>

        <div>
          <label>Duration (Seconds):</label>
          <input
            type="number"
            value={form.duration}
            onChange={(e) => setForm({...form, duration: e.target.value})}
            disabled={loading}
            min="1"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Create Order'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Order created successfully!</p>}
      </form>
    </div>
  );
};

export default CreateSellOrder;