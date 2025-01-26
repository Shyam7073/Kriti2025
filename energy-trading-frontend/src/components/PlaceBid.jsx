import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ethers } from 'ethers';

export default function PlaceBid({ contract, orderId }) {
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBid = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tx = await contract.placeBid(
        orderId,
        ethers.utils.parseUnits(bidAmount, 18)
      );
      await tx.wait();
      // Handle success
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleBid} className="mt-2">
      <Form.Group>
        <Form.Control
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter bid amount"
        />
      </Form.Group>
      <Button variant="success" type="submit" disabled={loading}>
        {loading ? 'Placing Bid...' : 'Place Bid'}
      </Button>
    </Form>
  );
}