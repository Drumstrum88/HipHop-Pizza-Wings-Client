import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { deleteOrderItem } from './api/orderItemData';
import { getSingleItem } from './api/itemData';

const OrderItemCard = ({ itemObj, setChange }) => {
  const [itemName, setItemName] = useState('');
  useEffect(() => {
    const fetchItemName = async () => {
      try {
        const itemDetails = await getSingleItem(itemObj.item);
        setItemName(itemDetails.name);
      } catch (error) {
        console.error('Error fetching item details', error);
        console.warn('Item details not fetched');
      }
    };
    fetchItemName();
  }, [itemObj.item]);
  const deleteThisItem = async () => {
    try {
      if (window.confirm('Delete item?')) {
        await deleteOrderItem(itemObj.id);
        setChange((prevState) => !prevState);
      }
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  return (
    <Card style={{ width: '17rem', marginRight: '20px', height: '20rem' }} className="carCard">
      <Card.Body>
        <Card.Title>{String(itemName)}</Card.Title>

        <h4>Price: $ {itemObj.price}</h4>
        <h4>Quantity: {itemObj.quantity}</h4>
        <Button variant="danger" onClick={deleteThisItem}>Delete</Button>
      </Card.Body>
    </Card>
  );
};

OrderItemCard.propTypes = {
  itemObj: PropTypes.shape({
    id: PropTypes.number.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    quantity: PropTypes.number.isRequired,
    item: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  setChange: PropTypes.func.isRequired,
};

export default OrderItemCard;
