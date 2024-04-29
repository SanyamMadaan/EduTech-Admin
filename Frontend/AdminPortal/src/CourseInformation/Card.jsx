import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Card(props) {
    const navigate = useNavigate();

    async function fetchCourses() {
        const response = await axios.get('http://localhost:3002/allcourses');
        props.setCourses(response.data);
    }

    async function deleteCourse(courseId) {
        const confirmDelete = window.confirm(`Are you sure to delete Course ${props.course.coursename}?`);
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await axios.delete(`http://localhost:3002/delete/${courseId}`);
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
        // const image = prompt("Enter Updated Course image", courseDetails.image);
        try {
            const response = await axios.put(`http://localhost:3002/update/${courseId}`, {
                coursename,
                description,
                price
                // image
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
        <div key={props.course._id} className="bg-white m-2 mb-4 min-h-min radius p-4 relative">
    <div className="min-h-12 w-full">
        <img src={props.course.image} alt={props.course.coursename} />
    </div>
    <hr/>
    <h1 className="text-3xl m-2 overflow-visible break-words">{props.course.coursename}</h1>
    <p className="overflow-visible m-2 break-words">{props.course.description}</p>
    <span className="overflow-visible ml-2 text-3xl break-words">₹{props.course.price}</span>
    <br />
    <div className="flex mt-4 justify-center items-center">
        <div className="w-1/2">
            <button className="border-2 border-black ml-1 p-2  text-white bg-teal-600" onClick={() => navigate('/content')}>View Content</button>
        </div>
        <div className="flex w-1/2 ml-auto">
            <button className="bg-green-800  w-1/2 border-2 border-black text-white cursor-pointer p-2 mr-1 " onClick={() => editCourse(props.course._id)}>Edit</button>
            <button className="bg-red-800 w-1/2 mr-1 border-2 border-black text-white cursor-pointer p-2" onClick={() => deleteCourse(props.course._id)}>Delete</button>
        </div>
    </div>
</div>

    
    );
    
}
