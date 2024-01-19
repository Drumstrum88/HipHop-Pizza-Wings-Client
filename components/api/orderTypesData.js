import { clientCredentials } from '../../utils/client';

const getOrderTypes = () => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/ordertypes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const getSingleOrderType = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/ordertypes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export { getOrderTypes, getSingleOrderType };
