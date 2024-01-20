import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleOrder, updateOrder } from '../../../components/api/orderData';
import CheckoutForm from '../../../components/ checkoutForm';

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (id) {
      getSingleOrder(id).then((data) => setOrderDetails(data));
    }
  }, [id]);

  const handleCheckout = async (checkoutData) => {
    try {
      const updatedOrder = { ...orderDetails, ...checkoutData };
      await updateOrder(updatedOrder);
      router.push(`/orders/${id}`);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div>
      <h2>Checkout Page</h2>
      {orderDetails && <CheckoutForm orderId={id} order={orderDetails} handleCheckout={handleCheckout} />}
    </div>
  );
}
