import { useState } from "react";
import "font-awesome/css/font-awesome.min.css";
import Header from "./components/Header";
import "./App.css";
import Footer from "./components/footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login-Pages/LoginPage";
import StudentDashboard from "./pages/Student-Pages/JSX-Files/student-dashboard";
import IntroPage from "./pages/IntroPage";
import MessSupervisorDashboardPage from "./pages/MessSupervisor-Pages/JSX-Pages/MessSupervisorDashboard";
import MessSupervisorDailyLogPage from "./pages/MessSupervisor-Pages/JSX-Pages/MessSupervisorDailyLog";
import MessSupervisorHelpPage from "./pages/MessSupervisor-Pages/JSX-Pages/MessSupervisorHelp";
import MessSupervisorGroceriesPage from "./pages/MessSupervisor-Pages/JSX-Pages/MessSupervisorGroceries";
import MessSupervisorMenuPage from "./pages/MessSupervisor-Pages/JSX-Pages/MessSupervisorMenu";
import MessSupervisorFeedbackPage from "./pages/MessSupervisor-Pages/JSX-Pages/MessSupervisorFeedback";
import MessAdminDashboardPage from "./pages/MessAdministrator-Pages/JSX_Pages/MessAdminDashboard";
import MessAdminAnnouncementsPage from "./pages/MessAdministrator-Pages/JSX_Pages/MessAdminAnnouncement";
import StudentAnnouncementsPage from "./pages/Student-Pages/JSX-Files/StudentAnnouncenments";
import WasteManagementPage from "./pages/MessAdministrator-Pages/JSX_Pages/MessAdminWM";
import MessAdminGroceryPage from "./pages/MessAdministrator-Pages/JSX_Pages/MessAdminGroceries";
import MessAdminQualityPage from "./pages/MessAdministrator-Pages/JSX_Pages/MessAdminQuality";
import MessAdminHelpPage from "./pages/MessAdministrator-Pages/JSX_Pages/MessAdminHelp";
import StudentMenuPage from "./pages/Student-Pages/JSX-Files/StudentMenu";
function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          {/* Route for Intro Page */}
          <Route path="/" element={<IntroPage />} />
          <Route path="/login/:role" element={<LoginPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route
            path="/Student Announcements"
            element={<StudentAnnouncementsPage />}
          />
          <Route
            path="/Mess Supervisor Dashboard/:messName"
            element={<MessSupervisorDashboardPage />}
          />
          <Route
            path="/Mess Supervisor DailyLog"
            element={<MessSupervisorDailyLogPage />}
          />
          <Route
            path="/Mess Supervisor Help"
            element={<MessSupervisorHelpPage />}
          />
          <Route
            path="/Mess Supervisor Groceries"
            element={<MessSupervisorGroceriesPage />}
          />
          <Route
            path="/Mess Supervisor Menu"
            element={<MessSupervisorMenuPage />}
          />
          <Route
            path="/Mess Supervisor Feedback"
            element={<MessSupervisorFeedbackPage />}
          />
          <Route
            path="/Mess Admin Dashboard"
            element={<MessAdminDashboardPage />}
          />
          <Route
            path="/Mess Admin Announcements"
            element={<MessAdminAnnouncementsPage />}
          />
          <Route path="/Mess Admin WM" element={<WasteManagementPage />} />
          <Route
            path="/Mess Admin Groceries"
            element={<MessAdminGroceryPage />}
          />
          <Route
            path="/Mess Admin Quality"
            element={<MessAdminQualityPage />}
          />
          <Route path="/Mess Admin Help" element={<MessAdminHelpPage />} />
          <Route path="/Student Menu" element={<StudentMenuPage />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
