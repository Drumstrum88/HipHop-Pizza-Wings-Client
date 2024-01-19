/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { getSingleOrder } from '../../components/api/orderData';
import OrderItemCard from '../../components/orderItemCard';
import ItemForm from '../../components/ItemForm';
import { createOrderItem, getSingleOrderItem, deleteOrderItem } from '../../components/api/orderItemData';

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const res = await getSingleOrder(id);
      console.warn('Order Details Response:', res); // Add this line
      setOrderDetails(res);
    } catch (error) {
      console.error('Error fetching order details', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    try {
      const items = await getSingleOrderItem(id);
      setAllItems(items);
    } catch (error) {
      console.error('Error fetching order items', error);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchOrderDetails();
      fetchAllItems();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleShowItemForm = () => {
    setShowItemForm(true);
  };

  const handleCloseItemForm = () => {
    setShowItemForm(false);
  };

  const handleAddItems = async (selectedItems) => {
    try {
      if (selectedItems.length > 0) {
        const itemId = selectedItems[0].item; // Extract the first item ID
        await createOrderItem({ order: orderDetails.id, item: itemId });
        await fetchAllItems();
      }
    } catch (error) {
      console.error('Error adding items to order', error);
      // Handle error appropriately
    }
    handleCloseItemForm();
  };

  const handleDeleteItem = async (item) => {
    try {
      await deleteOrderItem(item.id);
      fetchAllItems(); // Refresh item data
    } catch (error) {
      console.error('Error deleting item', error);
      // Handle error appropriately
    }
  };

  return (
    <div>
      <h2>Order Details</h2>
      {orderDetails && (
        <>
          <p>Order ID: {orderDetails.id}</p>
          <h2>Customer Phone: {orderDetails.customer_phone}</h2>
          <h2>Customer Email: {orderDetails.customer_email}</h2>
          <h2>Status: {orderDetails.status}</h2>
          <h2>Order Type: {orderDetails.type ? String(orderDetails.type.label) : 'N/A'}</h2>

        </>
      )}

      <div className="d-flex flex-wrap">
        {allItems && allItems.length > 0 ? (
          allItems.map((item) => (
            <OrderItemCard key={item.id} itemObj={item} onDeleteItem={() => handleDeleteItem(item)} />
          ))
        ) : (
          <p>No items available for this order.</p>
        )}
      </div>

      <Button onClick={handleShowItemForm}>Add/Edit Items</Button>
      <Link href="/components/payment" passHref>
        <Button>Checkout</Button>
      </Link>

      <ItemForm
        show={showItemForm}
        handleClose={handleCloseItemForm}
        handleAddItems={handleAddItems}
      />
    </div>
  );
}