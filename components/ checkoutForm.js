import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import { getPaymentTypes } from './api/payementData';
import { getSingleOrder } from './api/orderData';

const CheckoutForm = ({ orderId, handleCheckout }) => {
  const [tipAmount, setTipAmount] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});

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

  // Calculate subtotal by summing up the prices of order items
  const subtotal = items.reduce((acc, item) => acc + parseFloat(item.price), 0);

  // Calculate total by adding subtotal and tip amount
  const total = Number.isNaN(subtotal + parseFloat(tipAmount))
    ? 0
    : subtotal + parseFloat(tipAmount);

  const handleTipChange = (e) => {
    setTipAmount(e.target.value);
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform calculations and update order details
    const tip = parseFloat(tipAmount) || 0;
    const orderTotal = subtotal + tip;
    const paymentTypeId = paymentType && paymentType.id;
    const orderTypeId = orderDetails.type && orderDetails.type.id;
    handleCheckout({
      tip,
      payment: paymentTypeId,
      type: orderTypeId,
      is_closed: true,
      status: 'closed',
      total: orderTotal,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="subtotal">
        <Form.Label>Subtotal</Form.Label>
        <Form.Control type="text" readOnly value={`$${subtotal.toFixed(2)}`} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="tipAmount">
        <Form.Label>Tip Amount</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter tip amount"
          value={tipAmount}
          onChange={handleTipChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="paymentType">
        <Form.Label>Select Payment Type</Form.Label>
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
        <Form.Label>Total</Form.Label>
        <Form.Control type="text" readOnly value={`$${total.toFixed(2)}`} />
      </Form.Group>

      <Button className="generic-btn" type="submit">Submit Order</Button>
    </Form>
  );
};

CheckoutForm.propTypes = {
  orderId: PropTypes.string.isRequired,
  handleCheckout: PropTypes.func.isRequired,
};

export default CheckoutForm;
