import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

export function Content() {
    const navigate=useNavigate();
    const { courseId } = useParams();
    const [title, setTitle] = useState("");
    const [lectures, setLectures] = useState([]);

    useEffect(() => {
        async function fetchVideos() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/course/${courseId}/videos`);
                setLectures(res.data);
                console.log(res);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        }
        fetchVideos();
    }, [courseId]);

    
    return (
        <>
            <div className="p-2 flex justify-end">
            <button className=" bg-green-800 text-white p-2 cursor-pointer border-2 border-black-800 radius-md" onClick={()=>navigate(`/course/${courseId}/upload`)}>UPLOAD VIDEO</button>
            </div>
            
            <div>
                {lectures.length > 0 ?  lectures.map((vid, index) => (
                    <div key={vid._id} className="m-2 p-2 border-1 border-gray-300">
                        <h2 className="mb-2 text-2xl uppercase underline font-bold">{vid.title}</h2>
                        <video src={vid.videoUrl} controls muted className="lg:w-3/4 " />
                    </div>
                )) : <h1 className="text-red-800 text-2xl">No Content Added Yet</h1>}
            </div>
        </>
    );
}
