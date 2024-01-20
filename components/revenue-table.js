import React, { useState, useEffect } from 'react';
import { getClosedOrders } from './api/orderData';

const renderObject = (obj) => Object.entries(obj).map(([key, value]) => (
  <div key={key}>
    {key}: {value}
  </div>
));

const RevenueTable = () => {
  const [closedOrders, setClosedOrders] = useState([]);

  useEffect(() => {
    const fetchClosedOrders = async () => {
      try {
        const orders = await getClosedOrders();
        setClosedOrders(orders);
      } catch (error) {
        console.warn('Unable to fetch closed orders');
      }
    };

    fetchClosedOrders();
  }, []);

  const calculateTotalRevenue = () => closedOrders.reduce((total, order) => total + parseFloat(order.total), 0).toFixed(2);

  const calculateTotalTips = () => closedOrders.reduce((tip, order) => tip + parseFloat(order.tip), 0).toFixed(2);

  const countPaymentTypes = () => {
    const paymentTypeCounts = {};

    closedOrders.forEach((order) => {
      const { payment } = order;

      if (payment && payment.label) {
        paymentTypeCounts[payment.label] = (paymentTypeCounts[payment.label] || 0) + 1;
      } else {
        console.warn('Order with undefined or null paymentType:', order);
      }
    });

    return paymentTypeCounts;
  };

  const countOrderTypes = () => {
    const orderTypeCounts = {};

    closedOrders.forEach((order) => {
      const { type } = order;

      if (type && type.label) {
        orderTypeCounts[type.label] = (orderTypeCounts[type.label] || 0) + 1;
      } else {
        console.warn('Order with undefined or null orderType:', order);
      }
    });

    return orderTypeCounts;
  };

  return (
    <div>
      <h2>Revenue Table</h2>
      <table>
        <thead>
          <tr>
            <th>Total Revenue</th>
            <th>Total Tips</th>
            <th>Order Types</th>
            <th>Payment Types</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{calculateTotalRevenue()}</td>
            <td>{calculateTotalTips()}</td>
            <td>{renderObject(countOrderTypes())}</td>
            <td>{renderObject(countPaymentTypes())}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RevenueTable;
