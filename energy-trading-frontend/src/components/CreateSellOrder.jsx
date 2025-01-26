import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { ethers } from 'ethers';

export default function CreateSellOrder({ contract, account }) {
  const [form, setForm] = useState({
    amount: '',
    minPrice: '',
    maxPrice: '',
    duration: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tx = await contract.createSellOrder(
        ethers.utils.parseUnits(form.amount, 18),
        ethers.utils.parseUnits(form.minPrice, 18),
        ethers.utils.parseUnits(form.maxPrice, 18),
        form.duration * 86400
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
    <Card className="p-4 mb-4">
      <h3>Create Sell Order</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Amount (kWh)</Form.Label>
          <Form.Control
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
        </Form.Group>

        {/* Other form fields */}

        <Button variant="primary" type="submit" disabled={!account || loading}>
          {loading ? 'Processing...' : 'Create Order'}
        </Button>
      </Form>
    </Card>
  );
}