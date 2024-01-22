import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { getPaymentTypes } from './api/payementData';
import { getSingleOrder, updateOrder } from './api/orderData';

const CheckoutForm = ({ orderId }) => {
  const [tipAmount, setTipAmount] = useState('');
  const [paymentType, setPaymentType] = useState(0);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const router = useRouter();

  const fetchPaymentTypes = async () => {
    try {
      const types = await getPaymentTypes();
      setPaymentTypes(types);
    } catch (error) {
      console.error('Error fetching payment types', error);
    }
  };

  useEffect(() => {
    fetchPaymentTypes();
  }, []);

  useEffect(() => {
    if (orderId) {
      getSingleOrder(orderId)
        .then((data) => setOrderDetails(data))
        .catch((error) => console.error('Error fetching order details', error));
    }
  }, [orderId]);

  const items = orderDetails.items || [];
  const subtotal = items.reduce((acc, item) => acc + parseFloat(item.price), 0);
  const total = Number.isNaN(subtotal + parseFloat(tipAmount))
    ? 0
    : subtotal + parseFloat(tipAmount);

  const handleTipChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue);

    setTipAmount(Number.isNaN(numericValue) ? 0 : numericValue);
  };

  const handlePaymentTypeChange = (e) => {
    const selectedPaymentTypeId = e.target.value;
    const paymentTypeId = Number(selectedPaymentTypeId);

    setPaymentType(paymentTypeId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentType) {
      alert('Please select a payment type.');
      return;
    }

    const tip = parseFloat(tipAmount) || 0;
    const orderTotal = subtotal + tip;

    const typeId = orderDetails.type && typeof orderDetails.type === 'object' ? orderDetails.type.id : null;
    if (!orderDetails || !orderDetails.id) {
      console.error('Invalid order details:', orderDetails);
      alert('Failed to update order. Please try again.');
      return;
    }

    const checkoutData = {
      tip,
      payment: paymentType,
      type: typeId,
      is_closed: true,
      status: 'closed',
      total: orderTotal.toFixed(2),
      date: orderDetails.date,
    };

    try {
      const updatedOrder = await updateOrder({
        ...orderDetails,
        id: orderDetails.id,
        status: 'closed',
        name: orderDetails.name,
        customer_phone: orderDetails.customer_phone,
        customer_email: orderDetails.customer_email,
        type: orderDetails.type.id,
        ...checkoutData,
      });
      alert('Order submitted successfully!');
      router.push('/orders');
      console.warn('Updated Order:', updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="subtotal">
        <Form.Label className="heading">Subtotal:</Form.Label>
        <Form.Control type="text" readOnly value={`$${subtotal.toFixed(2)}`} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="tipAmount">
        <Form.Label className="heading">Tip Amount:</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter tip amount"
          value={tipAmount}
          onChange={handleTipChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="paymentType">
        <Form.Label className="heading">Select Payment Type:</Form.Label>
        <Form.Control
          as="select"
          value={paymentType}
          onChange={handlePaymentTypeChange}
        >
          <option value="">Select Payment Type</option>
          {paymentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group className="mb-3" controlId="total">
        <Form.Label className="heading">Total:</Form.Label>
        <Form.Control type="text" readOnly value={`$${total.toFixed(2)}`} />
      </Form.Group>

      <Button className="generic-btn" type="submit">Submit Order</Button>
    </Form>
  );
};

CheckoutForm.propTypes = {
  orderId: PropTypes.string.isRequired,
};

export default CheckoutForm;
