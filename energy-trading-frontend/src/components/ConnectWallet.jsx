import { Button } from 'react-bootstrap';
import { BrowserProvider, Contract } from 'ethers';
import { ENERGY_TRADING_ABI, ENERGY_TRADING_ADDRESS } from '../config';
import { useState } from 'react';
export default function ConnectWallet({ setAccount, setContract }) {
  const [error, setError] = useState('');

  const connect = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask');
        return;
      }

      // Request accounts
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Create browser provider
      const provider = new BrowserProvider(window.ethereum);
      
      // Get signer
      const signer = await provider.getSigner();
      
      // Create contract instance using imported ABI and address
      const contract = new Contract(
        ENERGY_TRADING_ADDRESS,
        ENERGY_TRADING_ABI,
        signer
      );

      setAccount(accounts[0]);
      setContract(contract);
      setError('');
    } catch (error) {
      console.error(error);
      setError('Failed to connect wallet: ' + error.message);
    }
  };

  return (
    <div className="text-center">
      <Button variant="primary" onClick={connect}>
        Connect Wallet
      </Button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
}