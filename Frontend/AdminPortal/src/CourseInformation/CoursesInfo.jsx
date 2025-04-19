import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "./Card";
import { useState, useEffect } from "react";

export function CourseInfo() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function getCourses() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/course/allcourses`
        );
        setCourses(response.data);
        setLoading(false);
      } catch (e) {
        console.log("Error while fetching courses");
        setLoading(false);
      }
    }
    getCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      {loading ? (
        <div className="text-center text-lg font-semibold text-gray-600">
          Loading...
        </div>
      ) : (
        <>
          {courses.length >= 1 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                  Published Courses
                </h1>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-200"
                  onClick={() => navigate("/addnewcourse")}
                >
                  + Add Course
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card
                    key={course._id}
                    course={course}
                    courses={courses}
                    setCourses={setCourses}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-red-600 font-semibold text-xl">
              No active courses
            </div>
          )}
        </>
      )}
    </div>
  );
}
