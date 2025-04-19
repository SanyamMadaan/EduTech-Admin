import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function Content() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/course/${courseId}/videos`);
        setLectures(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }
    fetchVideos();
  }, [courseId]);

  async function DeleteLecture(vid) {
    const confirmDelete = confirm("Are you sure you want to delete this lecture?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/course/${courseId}/videos/${vid}`, {
        headers: {
          admintoken: localStorage.getItem("adminToken"),
        },
      });

      setLectures((prev) => prev.filter((lec) => lec._id !== vid));
    } catch (e) {
      alert("Failed to delete lecture. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate(`/course/${courseId}/upload`)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow-md"
        >
          Upload Video
        </button>
      </div>

      {lectures.length > 0 ? (
        <div className="space-y-6">
          {lectures.map((vid) => (
            <div key={vid._id} className="bg-white rounded-md shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-gray-800 uppercase">{vid.title}</h2>
                <button
                  onClick={() => DeleteLecture(vid._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
              <video src={vid.videoUrl} controls muted className="w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-red-600 font-semibold text-xl mt-10">
          No content added yet.
        </div>
      )}
    </div>
  );
}
