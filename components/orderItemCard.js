import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { deleteOrderItem } from './api/orderItemData';
import { getSingleItem } from './api/itemData';

const OrderItemCard = ({ itemObj }) => {
  const [itemName, setItemName] = useState('');
  useEffect(() => {
    const fetchItemName = async () => {
      try {
        const itemDetails = await getSingleItem(itemObj.item);
        setItemName(itemDetails.name);
      } catch (error) {
        console.error('Error fetching item details', error);
        // Handle error gracefully
      }
    };
    fetchItemName();
  }, [itemObj.item]);
  const deleteThisItem = async () => {
    try {
      if (window.confirm('Delete item?')) {
        await deleteOrderItem(itemObj.id);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting item', error);
      // Handle error gracefully
    }
  };

  return (
    <Card style={{ width: '17rem', marginRight: '20px', height: '20rem' }} className="carCard">
      <Card.Body>
        <Card.Title>{String(itemName)}</Card.Title>

        <h4>Price: $ {String(itemObj.price)}</h4>
        <h4>Quantity: {String(itemObj.quantity)}</h4>
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
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderItemCard;
