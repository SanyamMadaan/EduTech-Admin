import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useState,useEffect } from 'react';

export function Admin_login(){
     

    const navigate=useNavigate();
    const[info,setInfo]=useState(false);
    const[email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const[button,setButton]=useState("Login");

        if(!info){
            alert('For exploring our website use sanyam@gmail.com as email address(lower case) and password as 12345');
            setInfo(true)
        }

    async function handleLogin(e){
        e.preventDefault();
        let response;
        try{
            setButton("Logging in...");
        response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/login`,{
            email,
            password
        })
        if(response){
            const token=response.data.token;
            localStorage.setItem("adminToken","Bearer "+token);
            navigate("/dashboard");
        }
      }catch(err){
        setButton("Login");
        console.log('inside catch');
        if(err.response){
            if(err.response.data.msg){
                console.log(err.response.data.msg);
                alert(err.response.data.msg)
    
         }
        }else{
            alert('Error while logging in..please try again after some time');
        }
        
       }
    }

return(
     <div className='h-screen bg-black p-2'>
     <h2 className='text-center text-white font-bold text-4xl mt-1'>Login as Admin</h2>
     <div className='mt-20 flex justify-center'>
     <form className='rounded-lg p-5 lg:w-1/4 lg:pb-10 pt-5  flex justify-center flex-col items-center border-2 border-x-white'  autoFocus onSubmit={handleLogin}>
        <input className='m-5 p-2 rounded-md w-4/5' type="Email" placeholder="Email" onChange={(e)=>{
            setEmail(e.target.value);
        }} autoFocus autofill="false" required/>
        <input className='m-5 p-2 rounded-md w-4/5' type="password" placeholder="Password" onChange={(e)=>{
            setPassword(e.target.value);
        }} autoFocus autofill="false" required/>
        <button className='m-5 p-3 rounded-md w-4/5 cursor-pointer bg-green-500 font-bold text-white  ' type="submit">{button}</button>
     </form>
     </div>
 </div>
)}