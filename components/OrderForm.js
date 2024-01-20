import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { createOrder, updateOrder } from './api/orderData';
import { getOrderTypes } from './api/orderTypesData';

const initialState = {
  name: '',
  customer_phone: '',
  customer_email: '',
  type: '',
};

function OrderForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  const [orderTypes, setOrderTypes] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.id) setFormInput(obj);
  }, [obj]);

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    fetchOrderTypes();
  }, []);

  const fetchOrderTypes = async () => {
    try {
      const types = await getOrderTypes();
      setOrderTypes(types);
    } catch (error) {
      console.error('Error fetching Order Types', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'type') {
      setFormInput((prevState) => ({
        ...prevState,
        type: value,
      }));
    } else {
      setFormInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user && user.uid) {
      const payload = { ...formInput, uid: user.uid };

      if (obj.id) {
        updateOrder(payload).then(() => router.push(`/orders/${obj.id}`));
      } else {
        createOrder(payload).then(() => router.push('/orders'));
      }
    } else {
      console.error('User not authenticated');
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{obj.id ? 'Update' : 'Create'} Order</h2>

      <FloatingLabel controlId="floatingInput1" label="Customer Name" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter a name"
          name="name"
          value={formInput.name}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput2" label="Customer Phone" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter customer's phone"
          name="customer_phone"
          value={formInput.customer_phone}
          onChange={handleChange}
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput3" label="Customer Email" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Customer Email"
          name="customer_email"
          value={formInput.customer_email}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel label="Select Order Type">
        <Form.Select
          placeholder="Order Type"
          onChange={handleChange}
          name="type"
          value={formInput.type}
        >
          <option>Choose Type</option>
          {orderTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>

      <Button className="generic-btn" type="submit" variant="dark">{obj.id ? 'Update' : 'Create'} Order</Button>
    </Form>
  );
}

OrderForm.propTypes = {
  obj: PropTypes.shape({
    name: PropTypes.string,
    customer_email: PropTypes.string,
    customer_phone: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
  }),
};

OrderForm.defaultProps = {
  obj: initialState,
};

export default OrderForm;
