import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddCourse() {
  const [course, setCourse] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const[button,setButton]=useState("Add Course");
  const navigate = useNavigate();

  const UploadFile = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", 'images_preset');

    try {
      let cloudName = "dv3vxqkwd";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const res = await axios.post(api, data);
      const { secure_url } = res.data; // Change source_url to secure_url
      console.log(secure_url);
      return secure_url;
    } catch (error) {
      console.log(error);
    }
  }

  const saveCourse = async (e) => {
    setButton("Adding...");
    e.preventDefault();
    const ImageUrl = await UploadFile(); // Get Cloudinary image link
    console.log(ImageUrl);
    console.log('token aata hoga');
    const token = localStorage.getItem("adminToken");
    console.log(token);
    try {
      console.log('inside try');
      const res=await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/course/addcourse`,
        {
          coursename: course,
          description: desc,
          price: price,
          image: ImageUrl
        },
        {
          headers: {
            admintoken: token,
          },
        }
      );
      const courseId=res.data._id;
      alert("Congratulations!! Course ADDED Successfully");
      navigate("/allcourses");
    } catch (error) {
      setButton("Add Course");
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
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
          >
{button}
          </button>
        </div>
      </form>
    </div>
  );
}
