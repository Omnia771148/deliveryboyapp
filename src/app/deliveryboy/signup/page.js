"use client";
import { useState } from "react";
import { storage } from "../../../../lib/firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from 'browser-image-compression';

export default function DeliveryBoySignup() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "",
    aadharUrl: "", rcUrl: "", licenseUrl: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState(""); 

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(fieldName);

    const options = {
      maxSizeMB: 0.1,          // 1. Reduced to 100KB (Ultra Fast)
      maxWidthOrHeight: 800,   // 2. Reduced to 800px (Saves CPU time)
      useWebWorker: true,
      initialQuality: 0.5,     // 3. Lower initial quality for instant processing
      alwaysKeepResolution: false
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `delivery_docs/${form.phone || "unknown"}/${fieldName}`);
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);
      
      setForm((prev) => ({ ...prev, [fieldName]: url }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Try again.");
    } finally {
      setUploadingField(""); 
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.aadharUrl || !form.rcUrl || !form.licenseUrl) {
        alert("Upload all 3 photos first!");
        return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/deliveryboy/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        // ADDED REDIRECT HERE
        window.location.href = "/deliveryboy/login";
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      alert("Signup error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <style>{`
        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #0070f3;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          margin-left: 10px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      <h2>Delivery Boy Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} style={inputStyle} />
        <input name="email" placeholder="Email" onChange={handleChange} style={inputStyle} />
        <input name="phone" placeholder="Phone" onChange={handleChange} style={inputStyle} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} style={inputStyle} />
        
        {/* Upload Fields */}
        {[ 
          { label: "Aadhar Card", field: "aadharUrl" },
          { label: "RC Book", field: "rcUrl" },
          { label: "Driving License", field: "licenseUrl" }
        ].map((item) => (
          <div key={item.field} style={uploadBox}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }}>{item.label}:</label>
            <input 
              type="file" accept="image/*" capture="environment" 
              onChange={(e) => handleFileUpload(e, item.field)} 
              disabled={!!uploadingField}
              style={{ display: "block", marginTop: "5px" }}
            />
            {uploadingField === item.field && <div className="loader"></div>}
            {form[item.field] && !uploadingField && <span style={{ color: "green", fontSize: "14px" }}> ✅ Done</span>}
          </div>
        ))}

        <button type="submit" style={btnStyle} disabled={isSubmitting || !!uploadingField}>
          {isSubmitting ? "Saving..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" };
const uploadBox = { marginBottom: "15px", padding: "12px", background: "#fefefe", borderRadius: "8px", border: "1px solid #eee", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" };
const btnStyle = { width: "100%", padding: "12px", background: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" };