import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Admin_login } from "./components/Admin_Login";
import { AdminDashboard } from "./components/AdminDashboard";
import { AddCourse } from "./CourseInformation/AddCourse";
import { CourseInfo } from "./CourseInformation/CoursesInfo";
import { EnrolledStudents } from "./CourseInformation/EnrolledStudents";
import { Content } from "./components/Content";
import { UploadLecture } from './components/UploadLecture';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Admin_login />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path='/addnewcourse' element={<AddCourse />} />
        <Route path="/enrolled_students" element={<EnrolledStudents />} />
        <Route path="/allcourses" element={<CourseInfo />} />
        <Route path="/course/:courseId" element={<Content />} />
        <Route path="/course/:courseId/upload" element={<UploadLecture />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
