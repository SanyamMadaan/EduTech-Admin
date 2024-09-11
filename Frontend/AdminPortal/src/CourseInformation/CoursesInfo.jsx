import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Card } from './Card';
import { useState } from 'react';
import { useEffect } from 'react';

export function CourseInfo(){ 
    
    const[courses,setCourses]=useState([]);
    const[loading,setLoading]=useState(true);

    useEffect(()=>{
        async function getCourses(){
            try{
            const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/course/allcourses`);
            setCourses(response.data);
            console.log(courses);
            setLoading(false);
            }catch(e){
                console.log("Error while fetching courses");
                setLoading(false);
            }
            }
            getCourses();
    },[]);

    const navigate=useNavigate();
    return(
        <>
        {loading?(
            <h1>Loading....</h1>
        ):(
            <>
        {(courses.length>=1)?(
        <div className='bg-black h-fit lg:h-screen'>
        <h1 className="text-white mb-10 p-5 text-4xl text-center">PUBLISHED COURSES</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-2 mx-4 '>
        {courses.map(course =>
                <Card course={course} courses={courses} setCourses={setCourses}></Card>    
        )}
        </div>
        </div>
        ):(
            <h1 className='text-red-800'>No active courses</h1>
        )
        }
        </>
        )
    }
        </>
    )
}