import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from './login';
import PatientRegistration from './patientregistration';
import DoctorDashboard from './Doctor';

function App() {
  return (
    <Router>
          <Routes>
            <Route path='/k' element = {<LoginPage />} />
            <Route path='/patient-registration' element = {<PatientRegistration />} />
            <Route path='/' element = {<DoctorDashboard />} />
          </Routes>
        </Router>
  );
}

export default App;
