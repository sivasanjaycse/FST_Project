import { useState } from 'react'
import 'font-awesome/css/font-awesome.min.css'
import Header from './components/Header'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import StudentLoginPage from './pages/StudentLoginPage'
import StudentDashboard from './pages/student-dashboard'
import IntroPage from './pages/IntroPage'
import MessSupervisorLogin from './pages/MessSupervisorLogin'
import StaffLogin from './pages/StaffLogin'
function App() 
{
  return (
    <div>
    <Router>
    <Header/>
      <Routes>
        {/* Route for Intro Page */}
        <Route path="/" element={<IntroPage />} />
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/Mess Supervisor login" element={<MessSupervisorLogin/>}/>
        <Route path='/Staff Login' element={<StaffLogin/>}/>
      </Routes>
    </Router>
    </div>
  );

}

export default App
