import { useEffect, useState } from 'react';
import { getOrders } from '../../components/api/orderData';
import OrderCard from '../../components/OrderCard';
import Loading from '../../components/Loading';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(true);

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
  }, [change]);

  return (
    <article>
      <h2>Open Orders:</h2>
      {loading ? (
        <Loading />
      ) : (
        <div className="d-flex flex-wrap">
          {orders.map((order) => (
            <section key={order.id}>
              <OrderCard orderObj={order} setChange={setChange} />
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
