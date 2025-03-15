import SupervisorNavbar from "./supervisorNavbar";
import "../Styles/dashboard.css";
const MessSupervisorDashboardPage = () => {
  return (
    <>
      <SupervisorNavbar onTabChange={(tabIndex) => console.log("Active Tab:", tabIndex)} />
      <div className="intro-page">
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <div className="supervisor-announcement-container">
        <h1>Announcements</h1>
        <ul className="supervisor-announcement-list">
          <li>Lorem.LoremLLorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,oreem ipsu,</li>
          <li>Lorem.LoremLLorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,oreem ipsu,</li>
          <li>Lorem.LoremLLorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,oreem ipsu,</li>
          <li>Lorem.LoremLLorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,oreem ipsu,</li>
          <li>Lorem.LoremLLorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,oreem ipsu,</li>
          <li>Lorem.LoremLLorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,oreem ipsu,</li>
          <li>Lorem.LoremLLorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,Lorem.LoremLoreem ipsu,oreem ipsu,</li>
        </ul>
      </div>
    </div> 
    </>
  );
};

export default MessSupervisorDashboardPage;
