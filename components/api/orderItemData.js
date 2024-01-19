import { clientCredentials } from '../../utils/client';

const getSingleOrderItem = (orderId) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/orders/${orderId}/items`)
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const createOrderItem = (payload) => new Promise((resolve, reject) => {
  console.warn('Payload:', payload);

  fetch('http://localhost:8000/orderitems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...payload, quantity: 1 }), // Include quantity
  })
    .then((response) => {
      console.warn('Response:', response);
      return response.json();
    })
    .then((data) => {
      console.warn('Data:', data);
      resolve(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      reject(error);
    });
});

const updateOrderItem = (orderItem) => new Promise((resolve, reject) => {
  fetch(`http://localhost:8000/orderitems/${orderItem.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderItem),
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const deleteOrderItem = (id) => new Promise((resolve, reject) => {
  fetch(`http://localhost:8000/orderitems/${id}`, {
    method: 'DELETE',
  })
    .then(resolve)
    .catch(reject);
});

export {
  getSingleOrderItem,
  updateOrderItem,
  createOrderItem,
  deleteOrderItem,
};
