import axios from 'axios';
import { CourseInfo } from '../CourseInformation/CoursesInfo';

export function AdminDashboard(){
    return(
        <div>
            <CourseInfo></CourseInfo>
        </div>
    )
}