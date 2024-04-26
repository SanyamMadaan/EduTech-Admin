import React, { useState } from "react";

export function Content() {
    const[video,setVideo]=useState("");
    const[title,setTitle]=useState("");

    function AddContent(){
        let videoURL=prompt("Please Enter the Video URL");
        setVideo(videoURL);
        let videotitle=prompt("Please Enter Video Title");
        setTitle(videotitle);
    }

    return (
        <>
        {
        (video.length<1)?
        <>
        <h1 className="text-red-800 text-2xl">No Content Added Yet</h1>
        </>:<div className="flex flex-col border-2 border-black">
        {title}
        {video}
        </div>
        }
            {/* <div className="fixed top-1 right-2">
                <button className="border-2 border-white text-white bg-black pl-2 pr-2 pb-1 cursor-pointer" onClick={AddContent}>ADD CONTENT</button>
            </div> */}
        </>
    )
}
