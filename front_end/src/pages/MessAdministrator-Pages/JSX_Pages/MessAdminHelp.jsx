import React, { useState } from "react";
import AdminNavbar from "./adminNavbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const MessAdminHelpPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AdminNavbar onTabChange={(tabIndex) => console.log("Active Tab:", tabIndex)} />
      <div className="help-page">
        <div className="help-container">
          <p className="help-heading">For Any Queries, Contact</p>
          <p className="help-content">
          <FontAwesomeIcon icon={faPhone} className="icon" /> +1234567890  
          <hr/>
          <FontAwesomeIcon icon={faEnvelope} className="icon" /> example@email.com  
          </p>
        </div>
      </div>

    </>
  );
};

export default MessAdminHelpPage;
