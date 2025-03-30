import React from 'react';
import { Form, useNavigate } from 'react-router-dom';
import '../CSS_Styles/student-dashboard.css'; // Import CSS for styling
import StudentNavbar from './studentNavbar'; // Import the student navbar component
const StudentDashboard = () => {
  const navigate = useNavigate();
  const counsellors = 
[   { Name: 'Mr.K.MOHAN KUMAR', hostel: 'Chemparuthi', contact: '9600625532', email: 'mohansaravanan33@gmail.com' },
    { Name: 'Mr.D.MEIGNANAMOORTHI', hostel: 'Ambal', contact: ' 9842616197', email: 'meimoorthi@gmail.com' },
    { Name: 'Mr.G.Thamelaaraachan', hostel: 'Mahizham', contact: '8220729480', email: 'thamelaaraachan1997@gmail.com' },
    { Name: 'Mr.P.Matan', hostel: ' Mantharai', contact: '8668191028', email: 'matansiva@gmail.com' },
    { Name: 'Mr.R.P.Vijay Aravinth', hostel: ' Sampanki', contact: '9486336293', email: 'vijay.cwr.au@gmail.com' },
    { Name: 'Mr.K.GURU PRAKASH', hostel: 'Samanthi', contact: '9790063775', email: ' guruprakash1996@gmail.com'}, 
    { Name: 'Mr.N.MAHEASWARAN', hostel: ' Anicham', contact: '9444298965', email: 'nmaheswaran97@gmail.com' },
    { Name: 'Mr.J.PRASANNA NAVEEN KUMAR', hostel: 'Sanbagam', contact: '9600644451', email: 'prasanme17@gmail.com'}
    
  ];

  return (
    <>
    <StudentNavbar /> 
    <div className="student-dashboard-page">
    <div className="dashboard-container">
      <h1>Welcome to CEG Hostels</h1>
      <p className='blackTxt'>&nbsp;The College of Engineering Guindy (CEG) Hostels
         aims to provide transparent administration with sound systems and procedures for effective management.
          Under the institution’s direct control, CEG Hostels comprises 22 blocks—14 for boys and 8 for girls, 
          named after Tamil flowers. The hostels offer a green, peaceful environment with abundant trees and 
          birdlife.<br/>&nbsp;The hostel management includes a Warden, Executive Warden, and Deputy Wardens, 
          who are faculty members, along with office staff managing administration. The hostel council, 
          consisting of wardens, resident counselors, a student chairman, and block secretaries,
           oversees hostel affairs. Mess management is handled by student-elected mess secretaries and 
           provision in-charges, ensuring cleanliness and hygiene.</p>
      <div class="Dean"><h2>Dean's Message</h2>
      <h3 color='blue'>Dr.K.S EASWARAKUMAR</h3></div>
      <img src="/Dean.png" alt="Dean" className="dean-img" />
      <p className='blackTxt'>Greetings! It’s my great pleasure to welcome all the College of Engineering Guindy hostel residents to CEG Hostel, where we provide the best facilities and homely environment for you throughout the CEG life. We strive to nurture and rebuild an atmosphere where every student feels welcome home vibe at the hostel. In a day’s course a student spends only two fold times more occasional stay at the hostel than the classroom premises, for which we extent a worry-free environment to enable them on concentrating their studies to attain the successful carrier in their life. The natural beauty of our hostel campus is fully surrounded by the trees which give the pleasant and green pollution free environment for the students to develop their academic life in a healthy way.

The CEG Hostels provides the facilities to the students with uninterrupted power supply, Wi-Fi, laundry, student amenities centre, coffee hut, smart projector hall, medical support, gym, library for hostel students, comfortable study rooms, quality food and the freedom to roam the green campus. As a part of green initiative and to reduce the energy dependence, we have a biogas plant running in the Mega mess for cooking purposes as a modern form energy which can be produced from the food and vegetable wastages.

As a Dean and Warden, I would like to encourage all the students to participate various technical and cultural activities inorder to develop and enhance the talents in the various fields. There are plenty of student’s clubs such as NSS, NCC, Rotaract, sirtuthuligal, mathavam, Green Brigade, CEG Tech form, Robotics club, Literary Clubs, Arts society, student association etc. are available to showcase the student talents.

We strive to provide a platform that enables student to concentrate fully on the academics and extra-curricular activities. To enable this, we provide the environment with the complete freedom on their choices and decisions, with the goal of providing the best for the hostelers. Resident counsellor stands the loco parentis in all the hostel blocks, inorder to ensure the students safety inside the hostel campus. I would like to inform all the students to strictly adhere the rules and regulations of the CEG hostels, since our campus is pollution free, students are anticipated to maintain the green and clean principles. Alcohol and Tobacco are strictly not allowed inside the campus and ragging is completely prohibited inside the campus. Strict disciplinary action will be taken, if anybody found indulging in these kinds of activities.

We strongly recommend you to take full part in the hostel culture, and never miss on having a friendly rapport CEG Hostels experience and make it possible to enjoy the student life. My best wishes to you for the wonderful life at this Green Campus in all aspects.</p>
<h3>List of Resident Counsellors </h3>
   {/* Resident Counsellors Table */}
   <div className="table-container">
        <table className="counsellor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Hostel</th>
              <th>Contact</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {counsellors.map((counsellor, index) => (
              <tr key={index}>
                <td>{counsellor.Name}</td>
                <td>{counsellor.hostel}</td>
                <td>{counsellor.contact}</td>
                <td><a href={`mailto:${counsellor.email}`}>{counsellor.email}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </>
  );
};

export default StudentDashboard;
