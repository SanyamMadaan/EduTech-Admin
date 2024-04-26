import { Admin_login } from "./components/Admin_Login";
import {AdminDashboard} from "./components/AdminDashboard";
import { AddCourse } from "./CourseInformation/AddCourse";
import { CourseInfo } from "./CourseInformation/CoursesInfo";
import { EnrolledStudents } from "./CourseInformation/EnrolledStudents";
import {Content} from "./components/Content";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import './App.css'

function App(){
  return <div>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Admin_login/>}></Route>
      <Route path="/dashboard" element={<AdminDashboard/>}></Route>
      <Route path='/addnewcourse' element={<AddCourse/>}></Route>
      <Route path="/enrolled_students" element={<EnrolledStudents/>}></Route>
      <Route path="/allcourses" element={<CourseInfo/>}></Route>
      <Route path="/content" element={<Content/>}></Route>
    </Routes>
    </BrowserRouter>
  </div>
}

export default App;