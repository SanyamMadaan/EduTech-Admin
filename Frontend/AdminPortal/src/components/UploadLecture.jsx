import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
export  function UploadLecture(){
    const [video, setVideo] = useState(null);
    const [thumbnail, setThumbnail] = useState("");
    const[button,setButton]=useState("Upload");
    const {courseId}=useParams();

    const uploadFile = async () => {
        const data = new FormData();
        data.append("file", video);
        data.append("upload_preset", 'images_preset');

        try {
            let cloudName = "dv3vxqkwd";
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
            const res = await axios.post(api, data);
            const { secure_url } = res.data;
            return secure_url;
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    const uploadVideo = async (e) => {
        console.log(courseId);
        e.preventDefault();
        const videoUrl = await uploadFile();
        setVideo(videoUrl);
        if (!videoUrl) {
            alert('no video selected');
            return;
        }
        try {
            setButton("Uploading...");
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/addvideo`, {
                courseId,
                title:thumbnail,
                videoUrl:video
            });
            alert("Video added successfully");
            setThumbnail("");
            setVideo(null);
        } catch (error) {
            setButton("Upload");
            console.error("Error adding video:", error);
        }
    };

    return(
        <div>
            <form onSubmit={uploadVideo}>
                <div className="m-2">
                    <div className="m-2">
                        <label>Enter Title</label><br/>
                        <input className="border-1 border-black p-2" type="text" onChange={(e) => setThumbnail(e.target.value)} placeholder="Title" />  
                    </div>
                    <div className="m-2">
                        <label>Select Lecture</label><br/>
                        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required />  
                    </div>
                    <br/>
                    <button type="submit" className="border-2 border-white text-white bg-black pl-2 pr-2 pb-1 cursor-pointer">{button}</button>
                </div>
                <hr/>
            </form>
        </div>
    )
}