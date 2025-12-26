"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

export default function Login() {
  const [users, setUsers] = useState([]); // This expects an Array
  const [inputPhone, setInputPhone] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const router = useRouter();

  // 1. Fetch ALL users when page loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/deliveryboy/login"); 
        const data = await res.json();
        
        // Safety check: ensure 'data' is actually an array before setting it
        if (Array.isArray(data)) {
            setUsers(data);
        } else {
            console.error("API did not return an array:", data);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch users");
      }
    };

    fetchUsers();

    const storedId = localStorage.getItem("userId");
    if (storedId) setLoggedInUserId(storedId);
  }, []);

  const handleLogin = () => {
    if (!inputPhone || !inputPassword) {
      alert("Please enter phone and password");
      return;
    }

    // 2. Client-side validation (The Old Method)
    // NOTE: This will only work if you stored passwords as Plain Text.
    // If you used bcrypt in signup, this check will fail (because "123" !== "$2b$10...").
    const matchedUser = users.find(
      (user) => user.phone === inputPhone && user.password === inputPassword
    );

    if (matchedUser) {
      localStorage.setItem("userId", matchedUser._id);
      setLoggedInUserId(matchedUser._id);
      alert("Login successful!");
      window.location.href= "/orderspage"
      // router.push("/dashboard");
    } else {
      alert("Incorrect phone or password");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>Delivery Boy Login (Old Method)</h2>

      <input
        type="text"
        placeholder="Phone"
        value={inputPhone}
        onChange={(e) => setInputPhone(e.target.value)}
        style={{ width: "100%", margin: "8px 0", padding: "8px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={inputPassword}
        onChange={(e) => setInputPassword(e.target.value)}
        style={{ width: "100%", margin: "8px 0", padding: "8px" }}
      />

      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", marginTop: "10px" }}
      >
        Login
      </button>

      {loggedInUserId && (
        <div style={{ marginTop: "20px" }}>
          <h3>Logged-in User ID:</h3>
          <p>{loggedInUserId}</p>
        </div>
      )}
    </div>
  );
}