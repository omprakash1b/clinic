import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Ensure your styles are in this file

export default function LoginPage() {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function login(empId, password) {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      return null;
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!empId || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    const data = await login(empId, password);

    if (!data) {
      alert("Invalid login credentials");
      return;
    }

    const userId = data["type"];
    localStorage.setItem("type", userId);
    alert("type" + userId);

    if (userId === 'doc') {
      navigate("/doctor-dashboard");
    } else {
      navigate("/patient-registration");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="empId">Employee ID</label>
          <input
            id="empId"
            type="text"
            className="small-input"
            placeholder="Enter your Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="small-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
