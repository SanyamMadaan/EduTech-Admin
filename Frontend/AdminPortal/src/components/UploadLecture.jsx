import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function UploadLecture() {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [button, setButton] = useState("Upload");
  const { courseId } = useParams();
  const navigate = useNavigate();

  const uploadFile = async () => {
    const data = new FormData();
    data.append("file", video);
    data.append("upload_preset", "images_preset");

    try {
      const cloudName = "dv3vxqkwd";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
      const res = await axios.post(api, data);
      return res.data.secure_url;
    } catch (error) {
      alert("Error uploading video");
      console.error("Video Upload Error:", error);
      return null;
    }
  };

  const uploadVideo = async (e) => {
    e.preventDefault();
    setButton("Uploading...");
    const videoUrl = await uploadFile();

    if (!videoUrl) {
      alert("No video URL returned.");
      setButton("Upload");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/course/addvideo`,
        {
          courseId,
          title,
          videoUrl,
        },
        {
          headers: {
            admintoken: localStorage.getItem("adminToken"),
          },
        }
      );

      alert("Lecture uploaded successfully!");
      navigate(`/course/${courseId}`);
      setTitle("");
      setVideo(null);
    } catch (error) {
      alert("Failed to upload lecture.");
      console.error("Upload Error:", error);
    } finally {
      setButton("Upload");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload New Lecture</h1>

      <form
        onSubmit={uploadVideo}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <label className="block text-gray-700 font-semibold mb-2">
          Lecture Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter lecture title"
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block text-gray-700 font-semibold mb-2">
          Select Video File
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          className="w-full p-2 mb-4 bg-white border border-gray-300 rounded-md"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          {button}
        </button>
      </form>
    </div>
  );
}
