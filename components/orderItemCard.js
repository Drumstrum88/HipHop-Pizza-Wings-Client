import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { deleteOrderItem } from './api/orderItemData';

const OrderItemCard = ({ itemObj }) => {
  const deleteThisItem = async () => {
    try {
      if (window.confirm('Delete item?')) {
        await deleteOrderItem(itemObj.id);
      }
    } catch (error) {
      console.error('Error deleting item', error);
      // Handle error gracefully
    }
  };

  return (
    <Card style={{ width: '17rem', marginRight: '20px', height: '20rem' }} className="carCard">
      <Card.Body>
        <Card.Title>{String(itemObj.item)}</Card.Title>

        <p>Price: $ {String(itemObj.price)}</p>
        <p>Quantity: {String(itemObj.quantity)}</p>
        <Button variant="danger" onClick={deleteThisItem}>Delete</Button>
      </Card.Body>
    </Card>
  );
};

OrderItemCard.propTypes = {
  itemObj: PropTypes.shape({
    id: PropTypes.number.isRequired,
    price: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    item: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderItemCard;
