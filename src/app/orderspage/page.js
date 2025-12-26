"use client";
import { useEffect, useState } from "react";

export default function AcceptedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const deliveryBoyId = localStorage.getItem("userId");

        if (!deliveryBoyId) {
          console.warn("No userId in localStorage");
          setOrders([]);
          setLoading(false);
          return;
        }

        const res = await fetch(
          `/api/acceptedorders?deliveryBoyId=${deliveryBoyId}`
        );

        if (!res.ok) {
          console.error("API error:", res.status);
          setOrders([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const rejectOrder = async (orderId) => {
    const deliveryBoyId = localStorage.getItem("userId");

    if (!deliveryBoyId) {
      alert("Login expired");
      return;
    }

    await fetch("/api/acceptedorders/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, deliveryBoyId }),
    });

    // remove only for THIS delivery boy
    setOrders((prev) => prev.filter((o) => o._id !== orderId));
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Accepted Orders</h2>

      {orders.length === 0 && <p>No orders available</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "15px",
            padding: "10px",
          }}
        >
          <p><b>Order ID:</b> {order.orderId}</p>
          <p><b>User ID:</b> {order.userId}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Total Items:</b> {order.totalCount}</p>
          <p><b>Total Price:</b> ₹{order.totalPrice}</p>
          <p><b>Restaurant ID:</b> {order.restaurantId}</p>
          <p><b>Order Date:</b> {new Date(order.orderDate).toLocaleString()}</p>
          <p><b>Rejected By:</b> {order.rejectedBy.join(", ") || "None"}</p>
          <p><b>Restaurent location:                 </b>{order.rest}</p>

          <h4>Items</h4>
          {order.items.map((item, index) => (
            <div key={index} style={{ marginLeft: "15px" }}>
              <p>• {item.name}</p>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {item.quantity}</p>
              
            </div>
          ))}

          <button
            onClick={() => rejectOrder(order._id)}
            style={{ marginTop: "10px", padding: "5px 10px" }}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
