import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddCourse() {
  const [course, setCourse] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState({myfile:""});
  const navigate = useNavigate();

const handleFileUpload=async(e)=>{
  const file=e.target.files[0];//convert this file into base64
  console.log(file);
  const base64=await convertToBase64(file);
  setImage(base64);
  console.log('image link is ');
  console.log(image);
}
  const saveCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(
        "http://localhost:3002/addcourse",
        {
          coursename: course,
          description: desc,
          price: price,
          image
        },
        {
          headers: {
            token: token,
          },
        }
      );
      alert("Congratulations!! Course ADDED Successfully");
      navigate("/allcourses");
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Error adding course");
    }
  };

  return (
    <div className="flex flex-col items-center bg-black h-screen">
      <h1 className="text-3xl font-semibold mb-5 text-white">Add New Course</h1>
      <form
        onSubmit={saveCourse}
        className="bg-white border border-gray-300 rounded-lg p-6 w-96"
      >
        <div className="mb-4">
          <label
            htmlFor="courseName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course Name
          </label>
          <input
            id="courseName"
            type="text"
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Enter course name"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Enter description"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price
          </label>
          <input
            id="price"
            type="number"
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>
        {/* File Upload Field */}
        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Course Image
          </label>
          <input
            id="file-upload"
            name="file"
            type="file"
            accept=".jpeg,.png,.jpg"
            className="border border-gray-300 rounded-lg p-3 w-full"
            onChange={(e)=>handleFileUpload(e)}
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
          >
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
}

function convertToBase64(file){
  return new Promise((resolve,reject)=>{
    const fileReader=new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload=()=>{
      resolve(fileReader.result)
    };
    fileReader.onerror=(error)=>{
      reject(error);
    }
  }
)
}
