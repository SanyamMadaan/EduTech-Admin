import {useNavigate} from 'react-router-dom';

export function Navbar(props){
    const navigate=useNavigate();
          return(
            <div className='bg-black w-full text-white flex justify-between p-4'>
            <div>
              <h1 className='text-xs  md:text-2xl'>{props.page}</h1>
            </div>
                <div className='text-xs lg:text-lg'>
                <button className="mr-4 cursor-pointer " onClick={()=>{
                    navigate('/addnewcourse')
                }}>ADD COURSE</button>
                <button className="mr-4 cursor-pointer" onClick={()=>{
                    navigate('/enrolled_students')
                    }}>ENROLLED STUDENTS</button>
                <button className="mr-3 cursor-pointer" onClick={()=>{
                    navigate('/allcourses')
                }}>COURSES</button>
            </div>
            </div>
          )
}