import { useEffect, useState } from 'react';
import { Card, ListGroup, Spinner } from 'react-bootstrap';

export default function SellOrders({ contract }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (contract) {
        try {
          const orders = await contract.getSellOrders();
          setOrders(orders);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchOrders();
  }, [contract]);

  if (loading) return <Spinner animation="border" />;

  return (
    <Card className="p-4">
      <h3>Active Sell Orders</h3>
      <ListGroup>
        {orders.map((order, index) => (
          <ListGroup.Item key={index}>
            {/* Order details */}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}