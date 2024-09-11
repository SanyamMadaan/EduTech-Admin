const express=require('express');
const router=express.Router();
const dotenv=require('dotenv');
const {Course,Video}=require('../db');
dotenv.config();
const authenticated_Admin=require('../middleware/authenticated');

router.post('/addcourse', authenticated_Admin, async (req, res) => {
    const { image, coursename, description, price } = req.body;
    try {
        const response = await Course.create({
            coursename,
            description,
            price,
            image
        });
        response.save();
        res.status(200).json({ msg: "Course created successfully", courseId: response._id });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ msg: "Error while creating course" });
    }
});

router.get('/allcourses', async (req, res) => {
    try {
        const courses = await Course.find({});
        if (courses.length >= 1) {
            return res.status(200).json(courses);
        } else {
            return res.status(200).json({ msg: "No courses added yet" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching courses" });
    }
});

router.get('/:courseId/videos', async (req, res) => {
    const { courseId } = req.params;
    try {
        const videos = await Video.find({ courseId });
        res.status(200).json(videos);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/:courseId', async (req, res) => {
    try {
        const courseId=req.params.courseId;
        console.log(courseId);
        const course = await Course.findById(courseId);
        if(!course) return res.status(400).json({msg:"No such course founded"});
        
        return res.status(200).json(course);
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching courses" });
    }
});



router.delete('/delete/:courseID',authenticated_Admin, async (req, res) => {
    const courseid = req.params.courseID;
    try {
        const deleteCourse = await Course.findById(courseid);
        if (deleteCourse) {
            await Course.deleteOne({ _id: deleteCourse._id });
            return res.status(200).json({ msg: "Course deleted Successfully" });
        }
        return res.status(500).json({ msg: "No course found" });
    } 
    catch (e) {
        return res.status(500).json({ msg: "Error while deleting course: " + e });
    }
});


router.put('/update/:courseId',authenticated_Admin, async (req, res) => {
    const { coursename, description, price,image } = req.body;
    const courseId = req.params.courseId;
    try {
        const updateCourse = await Course.findByIdAndUpdate(courseId, {
            coursename,
            description,
            price,
            image
        }, { new: true });

        if (updateCourse) {
            return res.status(200).json({ msg: "Course updated successfully" });
        } else {
            return res.status(500).json({ msg: "No such Course found" });
        }
    } catch (e) {
        return res.status(500).json({ msg: "Error while updating course: " + e });
    }
});

//lectures APIS

router.post('/addvideo',authenticated_Admin, async (req, res) => {
    const { courseId, title, videoUrl } = req.body;
    if (!courseId || !title || !videoUrl) {
        return res.status(400).json({ msg: "Missing required fields: courseId, title, or videoUrl" });
    }

    try {
        const course=await Course.findOne({_id:courseId});
        if(!course){
            return res.status(411).json({ msg: "No such Course Found" });
        }
        console.log('course founded');
        const video = new Video({
            courseId,
            title,
            videoUrl
        });
        await video.save();
        res.status(201).send(video);
    } 
    catch (error) {
        res.status(400).send({ msg: "Error adding video", error });
    }
});



router.delete('/:courseId/videos/:vid',authenticated_Admin,async(req,res)=>{
    const videoUrl=req.params.vid;
    
    try{
        const videoToBeDeleted=await Video.findById(videoUrl);
        if(videoToBeDeleted){
            await Video.deleteOne({_id:videoToBeDeleted});
            return res.status(200).json({msg:"Video deleted successfully"});
        }
         return res.status(500).json({msg:"No such video founded"}); 
    }
    catch(e){
        console.log('inside catch');
        console.log(e);
        return res.status(500).json({msg:"Error while deleting video: "+e});
    }
})

module.exports=router;