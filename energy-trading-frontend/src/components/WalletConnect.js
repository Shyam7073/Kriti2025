// import React, { useState } from 'react';
// import { ethers } from 'ethers';

// const WalletConnect = ({ onWalletConnected }) => {
//   const [account, setAccount] = useState(null);
//   const [provider, setProvider] = useState(null);
//   const [network, setNetwork] = useState(null);

//   const connectWallet = async () => {
//     try {
//       if (window.ethereum) {
//         const newProvider = new ethers.BrowserProvider(window.ethereum);
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

//         setProvider(newProvider);
//         setAccount(accounts[0]);
//         const networkDetails = await newProvider.getNetwork();
//         setNetwork(networkDetails);

//         onWalletConnected(newProvider, accounts[0]);

//         console.log("Connected to:", accounts[0]);
//         console.log("Network:", networkDetails.name);
//       } else {
//         alert("MetaMask is not installed!");
//       }
//     } catch (err) {
//       console.error("Error connecting wallet:", err);
//     }
//   };

//   return (
//     <div>
//       <button onClick={connectWallet}>Connect Wallet</button>
//       {account && (
//         <div>
//           <p>Account: {account}</p>
//           <p>Network: {network?.name}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WalletConnect;
import React, { useState } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ onWalletConnected }) => {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const networkDetails = await newProvider.getNetwork();
        
        // Remove unused provider state
        setAccount(accounts[0]);
        setNetwork(networkDetails);
        onWalletConnected(newProvider, accounts[0]);

        console.log("Connected to:", accounts[0]);
        console.log("Network:", networkDetails.name);
      } else {
        alert("MetaMask is not installed!");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && (
        <div>
          <p>Account: {account}</p>
          <p>Network: {network?.name}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;