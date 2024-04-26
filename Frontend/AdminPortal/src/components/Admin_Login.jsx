import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

export function Admin_login(){
    const navigate=useNavigate();

    const[email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    async function handleLogin(e){
        e.preventDefault();
        try{
        const response=await axios.post("http://localhost:3002/login",{
            email,
            password
        })
        console.log(response);
        if(response){
            const token=response.data.token;
            localStorage.setItem("adminToken","Bearer "+token);
            navigate("/dashboard");
        }
      }catch(err){
            
            if(err.response.data.msg){
                alert(err.response.data.msg);
            }
            else{
                alert(err.message);
            }
             }
    }

return(
     <div className='h-screen bg-black p-2'>
     <h2 className='text-center text-white font-bold text-4xl mt-1'>Login as Admin</h2>
     <div className='mt-20 flex justify-center'>
     <form className='pb-10 pt-5  flex justify-center flex-col items-center border-2 border-x-white w-1/3'  autoFocus onSubmit={handleLogin}>
        <input className='m-5 p-2 rounded-md w-4/5' type="Email" placeholder="Email" onChange={(e)=>{
            setEmail(e.target.value);
        }} autoFocus autofill="false" required/>
        <input className='m-5 p-2 rounded-md w-4/5' type="password" placeholder="Password" onChange={(e)=>{
            setPassword(e.target.value);
        }} autoFocus autofill="false" required/>
        <button className='m-5 p-3 rounded-md w-4/5 cursor-pointer bg-green-500 font-bold text-white  ' type="submit">Login</button>
     </form>
     </div>
 </div>
)}