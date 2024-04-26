import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddCourse() {
    const [course, setCourse] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState(0);
    // const [image, setImage] = useState("");
    const navigate = useNavigate();

    async function AddCourseDetails(e) {
        e.preventDefault(); // Prevent default form submission behavior
        console.log("Submitting data");
        console.log(course);
        console.log(desc);
        console.log(price);
        // console.log(image);
        const token = localStorage.getItem("adminToken");
    
        try {
            await axios.post("http://localhost:3002/addcourse",{
                "coursename":course,
                "description":desc,
                price,
                // image
            }, {
                headers: {
                    "token": token, // Include the token header
                }
            });
            alert("Congratulations!! Course ADDED Successfully");
            navigate("/allcourses");
        } catch (error) {
            console.error("Error adding course:", error);
            alert('inside catch');
            navigate("/allcourses");
        }
    }

    // const HandleFileUpload=async(e)=>{
    //     const file=e.target.files[0];
    //     const base64=await ConvertToBase64(file);
    //     setImage(base64);
    // }
    
    return (
        <>
        <div className="flex flex-col items-center bg-black h-screen">
    <h1 className="text-3xl font-semibold mb-5 text-white">Add New Course</h1>
    <div className="bg-white border border-gray-300 rounded-lg p-6 w-96">
        <form onSubmit={AddCourseDetails}>
            <div className="mb-4">
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
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
            {/* <div className="mb-4">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Course Image</label>
                <input
                    id="file"
                    type="file"
                    className="border border-gray-300 rounded-lg p-3 w-full"
                    onChange={(e) => HandleFileUpload(e)}
                    required
                />
            </div> */}
            <div className="flex justify-center">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none">
                    Add Course
                </button>
            </div>
        </form>
    </div>
</div>

        </>
        // <div className="flex justify-center items-center flex-col">
        //     <h1 className="text-2xl underline font-semibold">ADD NEW COURSE</h1>
        //     <div className="flex flex-col mt-5 border-2 border-black border-md min-h-60">
        //         <form
        //             className="border-2-black min-h-28"
        //             onSubmit={AddCourseDetails}
        //         >
        //             <input
        //                 className="border-1 border-black m-2 rounded p-5 text-black"
        //                 type="text"
        //                 onChange={(e) => setCourse(e.target.value)}
        //                 placeholder="Course Name"
        //                 required
        //             />
        //             <br />
        //             <input
        //                 className="border-1-black m-2 rounded p-5 text-black"
        //                 type="text"
        //                 onChange={(e) => setDesc(e.target.value)}
        //                 placeholder="Description"
        //                 required
        //             />
        //             <br />
        //             <input
        //                 className="border-1-black m-2 rounded p-5 text-black"
        //                 type="number"
        //                 onChange={(e) => setPrice(e.target.value)}
        //                 placeholder="Price"
        //                 required
        //             />
        //             <br />
        //             {/* <input
        //                 className="border-1-black m-2 rounded p-5 text-black"
        //                 type="file"
        //                 onChange={(e) => HandleFileUpload(e)}
        //                 required
        //             />
        //             <br /> */}
        //             <div className="flex items-center justify-center">
        //                 <button type="submit" className="border-2 border-black p-2 mt-5 mb-5 text-white bg-green-600 text-center">
        //                     ADD COURSE
        //                 </button>
        //             </div>
        //         </form>
        //     </div>
        //  </div>
        
    );
}

// function ConvertToBase64(file){
//     return new Promise((resolve,reject)=>{
//         const fileReader=new FileReader();
//         fileReader.readAsDataURL(file);
//         fileReader.onload=()=>{
//             resolve(fileReader.result);
//         };
//         fileReader.onerror=(error)=>{
//             reject(error)
//         }
//     })
// }