import { useEffect, useState } from 'react';
import { getOrders } from '../../components/api/orderData';
import OrderCard from '../../components/OrderCard';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllOrders = () => {
    getOrders()
      .then((data) => {
        const openOrders = data.filter((order) => order.status !== 'closed');

        setOrders(openOrders);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <article>
      <h2>Open Orders:</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="d-flex flex-wrap">
          {orders.map((order) => (
            <section key={order.id}>
              <OrderCard orderObj={order} />
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
