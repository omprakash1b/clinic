import React, { useState } from "react";
import "./PatientRegistration.css"; // Import the CSS file

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    conditions: "",  // Fixed field name
    fees: "",
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/patient-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),  // Send correct field names
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Patient registered successfully! ID: ${data.id}`);
        setFormData({ name: "", age: "", conditions: "", fees: "" });
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Error connecting to the server.");
    }
  };

  return (
    <div className="patient-container">
      <div className="patient-card">
        <h2>🩺 Patient Registration</h2>
        {message && <p className="alert">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Condition</label>
            <input type="text" name="conditions" value={formData.conditions} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Fees (₹)</label>
            <input type="number" name="fees" value={formData.fees} onChange={handleChange} required />
          </div>

          <button type="submit" className="submit-btn">Register Patient</button>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
