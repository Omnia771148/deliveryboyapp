"use client";
import { useState } from "react";

export default function DeliveryBoySignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/deliveryboy/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div style={{ maxWidth: 350, margin: "100px auto" }}>
      <h2>Delivery Boy Signup</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <br /><br />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <br /><br />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <br /><br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <br /><br />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
