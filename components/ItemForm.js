import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';
import { getItems } from './api/itemData';

const initialState = [];

const ItemForm = ({
  show, handleClose, handleAddItems,
}) => {
  const [formInput, setFormInput] = useState(initialState);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items when the component mounts
    getItems()
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []); // Empty dependency array ensures useEffect runs only once

  const handleQuantityChange = (item, quantity) => {
    setFormInput((prevInput) => {
      const existingItemIndex = prevInput.findIndex((entry) => entry.item.id === item.id);

      if (existingItemIndex !== -1) {
        // Update quantity for existing item
        const updatedInput = [...prevInput];
        updatedInput[existingItemIndex] = { item, quantity: Number(quantity) };
        return updatedInput;
      }
      // Add new item to the input
      return [...prevInput, { item, quantity: Number(quantity) }];
    });
  };

  const handleAddToOrder = (e) => {
    e.preventDefault();

    // Filter out items with valid positive quantities
    const selectedItems = formInput
      .filter((entry) => Number.isInteger(entry.quantity) && entry.quantity > 0)
      .map(({ item, quantity }) => ({ item: item.id, quantity }));

    console.warn('Selected Items:', selectedItems);

    // Pass selectedItems to handleAddItems function
    handleAddItems(selectedItems);

    // Clear the formInput state
    setFormInput(initialState);

    // Close the modal
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      {/* ... Modal content */}
      <Modal.Body>
        <Form>
          {items && items.length > 0 ? (
            items.map((item) => (
              <Form.Group key={item.id}>
                <Form.Check
                  type="checkbox"
                  label={`${item.name} - ${item.price}`}
                  onChange={(e) => handleQuantityChange(item, e.target.checked ? 1 : 0)}
                />
                <Form.Control
                  type="number"
                  placeholder="Quantity"
                  value={(formInput.find((entry) => entry.item.id === item.id) || {}).quantity || ''}
                  onChange={(e) => handleQuantityChange(item, e.target.value)}
                  disabled={!formInput.some((entry) => entry.item.id === item.id)}
                />
              </Form.Group>
            ))
          ) : (
            <p>No items available.</p>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddToOrder}>
          Add to Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ItemForm.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAddItems: PropTypes.func.isRequired,
};

export default ItemForm;
