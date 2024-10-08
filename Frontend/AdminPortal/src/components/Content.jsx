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

    async function DeleteLecture(vid){
        let surity=confirm('Are You sure to delete this lecture from Database?');
        if(!surity) return;
        const res=await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/course/${courseId}/videos/${vid}`,{
            headers:{
                admintoken:localStorage.getItem('adminToken')
            }
        });
        setLectures(lectures.filter(lec=>lec._id!==vid));
    }
    
    return (
        <>
            <div className="p-2 flex justify-end">
            <button className=" bg-green-800 text-white p-2 cursor-pointer border-2 border-black-800 radius-md" onClick={()=>navigate(`/course/${courseId}/upload`)}>UPLOAD VIDEO</button>
            </div>
            
            <div>
                {lectures.length > 0 ?  lectures.map((vid, index) => (
                    <div key={vid._id} className="m-2 p-2 border-1 border-gray-300">
                        <div className="flex mb-2 justify-between ">
                        <h1 className="mb-2 text-3xl uppercase underline  font-bold">{vid.title}</h1>
                            <button className=" border-2-black bg-red-800 text-white p-2 rounded-md cursor-pointer" onClick={()=>DeleteLecture(vid._id)}>Delete</button>
                        </div>
                        
                        <div className="w-full m-2 h-1/5">
                        <video   src={vid.videoUrl} controls muted  />
                        </div>
                        
                    </div>
                )) : <h1 className="text-red-800 text-2xl">No Content Added Yet</h1>}
            </div>
        </>
    );
}
