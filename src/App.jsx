import { useState } from 'react'
import 'font-awesome/css/font-awesome.min.css'
import Header from './components/Header'
import './App.css'
import Footer from './components/footer'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import StudentLoginPage from './pages/StudentLoginPage'
import StudentDashboard from './pages/student-dashboard'
import IntroPage from './pages/IntroPage'
import MessSupervisorLogin from './pages/MessSupervisorLogin'
import MessAdminLoginPage from './pages/MessAdminLogin'
import MessSupervisorDashboardPage from './pages/MessSupervisor-Pages/JSX-Pages/MessSupervisorDashboard'
import MessSupervisorDailyLogPage from './pages/MessSupervisor-Pages/JSX-Pages/MessSupervisorDailyLog'
import MessSupervisorHelpPage from './pages/MessSupervisor-Pages/JSX-Pages/MessSupervisorHelp'
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
        <Route path="/Mess Supervisor Dashboard" element={<MessSupervisorDashboardPage/>}/>
        <Route path="/Mess Supervisor DailyLog" element={<MessSupervisorDailyLogPage/>}/>
        <Route path='/Mess Supervisor Help' element={<MessSupervisorHelpPage/>}/>
        <Route path='/Mess Administrator Login' element={<MessAdminLoginPage/>}/>
      </Routes>
    </Router>
    <Footer/>
    </div>
  );

}

export default App
