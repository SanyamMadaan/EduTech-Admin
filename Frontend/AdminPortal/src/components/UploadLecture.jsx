import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export function UploadLecture() {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [button, setButton] = useState("Upload");
  const { courseId } = useParams();

  const navigate=useNavigate();

  const uploadFile = async () => {
    const data = new FormData();
    data.append("file", video);
    data.append("upload_preset", "images_preset");

    try {
      let cloudName = "dv3vxqkwd";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      return secure_url;
    } 
    catch (error) {
    alert('error while uploading video');
      console.log("Error uploading video:", error);
    }
  };

  const uploadVideo = async (e) => {
    setButton("Uploading...");
    console.log(courseId);
    e.preventDefault();
    const videoUrl = await uploadFile();
    console.log("videoUrl is "+videoUrl);
    setVideo(videoUrl);
    if (!videoUrl) {
      alert("no video selected");
      return;
    }
    try {
      setButton("Uploading...");
      console.log('sending video is'+video);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/addvideo`, {
        courseId,
        title: thumbnail,
        videoUrl: video,
      },{
        headers:{
            admintoken:localStorage.getItem('adminToken')
        }
      });
      alert("Video added successfully");
      setButton("Upload");
      navigate(`/course/${courseId}`);
      setThumbnail("");
      setVideo(null);
    } catch (error) {
      setButton("Upload");
      console.error("Error adding video:", error);
    }
  };

  return (
    <div className="bg-black h-screen">
      <h1 className="mb-2 pt-2 text-center text-3xl font-bold text-white">
        UPLOAD LECTURE
      </h1>

      <div className="flex justify-center mt-20 ">

      <form className="flex flex-col w-2/3 p-5 md:w-1/3 md:h-1/2 justify-center bg-white rounded-md"
        onSubmit={uploadVideo}
      >
        
            <input
              className="border-2 border-black w-2/3 rounded-md m-2 p-2"
              type="text"
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="Title"
            />
            <input
              className="rounded-lg m-2 p-2"
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              required
            />
            <button
              type="submit"
              className="font-bold m-3 border-2 border-black text-white bg-black p-2 cursor-pointer rounded-lg"
            >
              {button}
            </button>
        
      </form>
      </div>
    </div>
  );
}
