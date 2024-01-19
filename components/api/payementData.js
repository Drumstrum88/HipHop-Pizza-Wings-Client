import { clientCredentials } from '../../utils/client';

const getPaymentTypes = () => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/paymenttypes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const getSinglePaymentType = (id) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export { getPaymentTypes, getSinglePaymentType };
