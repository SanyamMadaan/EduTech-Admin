import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Card(props) {
    const navigate = useNavigate();

    async function fetchCourses() {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/course/allcourses`);
        props.setCourses(response.data);
    }

    async function deleteCourse(courseId) {
        const confirmDelete = window.confirm(`Are you sure to delete Course ${props.course.coursename}?`);
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/course/delete/${courseId}`,{
                headers:{
                    admintoken:localStorage.getItem('adminToken')
                }
            });
            if (response.status === 200) {
                alert('Course deleted successfully');
                fetchCourses();
            } else {
                alert('Error while deleting course');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error while deleting course');
        }
    }

    async function editCourse(courseId) {
        const courseDetails = props.courses.find(course => course._id === courseId);
        const coursename = prompt("Enter Updated Course name", courseDetails.coursename);
        const description = prompt("Enter Updated Course description", courseDetails.description);
        const price = prompt("Enter Updated Course price", courseDetails.price);
        const image = prompt("Enter Updated Course image", courseDetails.image);
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/course/update/${courseId}`, {
                coursename,
                description,
                price,
                image
            },{
                headers:{
                    admintoken:localStorage.getItem('adminToken')
                }
            });
            if (response.status === 200) {
                alert('Course Updated Successfully');
                fetchCourses();
            } else {
                alert("Error while Updating Course");
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error while Updating Course');
        }
    }

    return (
        <div key={props.course._id} className="bg-white h-fit m-2 mb-4 rounded-lg radius p-4 ">
    <div className="mb-5" >
        <img className="h-48 w-full" src={props.course.image} alt={props.course.coursename} />
    <hr/>
    <h1 className="text-3xl m-2 overflow-visible break-words">{props.course.coursename}</h1>
    <p className="overflow-visible m-2 break-words">{props.course.description}</p>
    <span className="overflow-visible ml-2 text-3xl break-words">₹{props.course.price}</span>
    <br />
    </div>
    <div className="flex mt-4 justify-center items-center">
        <div className="w-1/2">
            <button className="border-2 border-black ml-1 p-2  text-white bg-blue-950 rounded-md" onClick={() => navigate(`/course/${props.course._id}`)}>View Content</button>
        </div>
        <div className="flex w-1/2 ml-auto">
            <button className="bg-green-800  w-1/2 border-2 border-black rounded-md text-white cursor-pointer p-2 mr-1 " onClick={() => editCourse(props.course._id)}>Edit</button>
            <button className="bg-red-800 w-1/2 mr-1 border-2 border-black rounded-md text-white cursor-pointer p-2" onClick={() => deleteCourse(props.course._id)}>Delete</button>
        </div>
    </div>
</div>
     
    );
}
