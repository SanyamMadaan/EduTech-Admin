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
    // const imageDataUrl = `data:image/jpeg;base64,${props.course.image}`;
    return (
        <div key={props.course._id} className="bg-white m-2 mb-4 min-h-min radius p-4">
            <div className="min-h-12 w-full">
                <img src={"data:image/jpeg;base64,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"} alt={props.course.coursename} />
            </div>
            <hr/>
            <h1 className="text-3xl m-2 overflow-visible break-words">{props.course.coursename}</h1>
            <p className="overflow-visible m-2 break-words">{props.course.description}</p>
            <span className="overflow-visible ml-2 text-3xl break-words">₹{props.course.price}</span>
            <br />
            <div className="flex mt-4 justify-center items-center">
                <div className="w-1/2">
                    <button className="border-2 border-black ml-1 p-2 text-white bg-teal-600" onClick={() => navigate('/content')}>View Content</button>
                </div>
                <div className="flex w-1/2">
                    <button className="bg-green-800 w-1/2 border-2 border-black text-white cursor-pointer p-2 mr-1 " onClick={() => editCourse(props.course._id)}>Edit</button>
                    <button className="bg-red-800 w-1/2 mr-1 border-2 border-black text-white cursor-pointer p-2" onClick={() => deleteCourse(props.course._id)}>Delete</button>
                </div>
            </div>
        </div>
    );
    
}
