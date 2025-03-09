import React, { useState, useEffect } from "react";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPrescription, setNewPrescription] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all patients
  useEffect(() => {
    fetch("http://localhost:5000/getpatients")
      .then((res) => res.json())
      .then((data) => setPatients(data.results))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  // Handle prescription update
  const handleUpdatePrescription = async () => {
    if (!selectedPatient || !newPrescription.trim()) {
      setMessage("⚠️ Please select a patient and enter a prescription.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/pres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_id: selectedPatient.token_id,
          pres: newPrescription,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Prescription updated successfully!");
        setPatients((prevPatients) =>
          prevPatients.map((p) =>
            p.token_id === selectedPatient.token_id
              ? { ...p, prescription: newPrescription }
              : p
          )
        );
        setNewPrescription("");
        setSelectedPatient(null);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Error updating prescription.");
    }
  };

  return (
    <div className="doctor-container">
      <h2>👨‍⚕️ Doctor's Dashboard</h2>

      {/* Search Bar */}
      <input
        type="text"
        className="search-box"
        placeholder="🔍 Search patient by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Patient List */}
      <div className="patient-list">
        {patients
          .filter((patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((patient) => (
            <div
              key={patient.token_id}
              className={`patient-card ${
                selectedPatient?.token_id === patient.token_id ? "selected" : ""
              }`}
              onClick={() => setSelectedPatient(patient)}
            >
              <h4>{patient.name} (Age: {patient.age})</h4>
              <p>Condition: {patient.conditions}</p>
              <p>Current Prescription: {patient.prescription || "None"}</p>
            </div>
          ))}
      </div>

      {/* Update Prescription */}
      {selectedPatient && (
        <div className="prescription-box">
          <h3>📝 Update Prescription for {selectedPatient.name}</h3>
          <input
            type="text"
            className="prescription-input"
            placeholder="Enter new prescription"
            value={newPrescription}
            onChange={(e) => setNewPrescription(e.target.value)}
          />
          <button className="update-btn" onClick={handleUpdatePrescription}>
            Update Prescription
          </button>
        </div>
      )}

      {/* Status Message */}
      {message && <p className="alert">{message}</p>}
    </div>
  );
};

export default DoctorDashboard;
