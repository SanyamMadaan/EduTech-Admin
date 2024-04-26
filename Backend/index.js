const express = require('express');
const { Admin, Course } = require('./db');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const secret = require('./config');
const authenticated_Admin = require('./middleware/authenticated');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// const fs = require('fs');
// const path = require('path');

//...

app.post('/addcourse', async (req, res) => {
    const coursename=req.body.coursename;
    const description=req.body.description;
    const price=req.body.price;
    // const image=req.body.image;

    // Save the image file to the server
    // const imageFilePath = path.join(__dirname, 'uploads', image.filename);
    // const imageFileData = Buffer.from(image.base64Data, 'base64');
    // fs.writeFileSync(imageFilePath, imageFileData);

    // Create a new Course document
    try {
        const response=await Course.create({
            coursename,
            description,
            price,
            // image: image.filename // Store filename in the Course collection
        });
        console.log(response);
        res.status(200).json({ msg: "Course created successfully" });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ msg: "Error while creating course" });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await Admin.findOne({ email, password });

        if (!response) {
            return res.status(411).json({ msg: "No such Admin Found or Incorrect email/password" });
        }

        const userId = response._id;
        const token = jwt.sign({ userId }, secret);

        return res.status(200).json({ token });
    } catch (e) {
        return res.status(411).msg({ msg: "Error while searching Admin" + e });
    }
});
app.get('/allcourses', async (req, res) => {
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


app.delete('/delete/:courseID',async (req,res)=>{
    const courseid=req.params.courseID;
    try{
        const deleteCourse=await Course.findById(courseid);
        console.log(deleteCourse);
            if(deleteCourse){
                await Course.deleteOne({
                    _id:deleteCourse._id
                })
                return res.status(200).json({msg:"Course deleted Successfully"})
            }
            return res.status(500).json({msg:"No course found"})
        }
    catch(e){
        return res.status(500).json({msg:"Error while deleting course.."})
    }
})

app.put('/update/:courseId',async (req,res)=>{
    const {coursename,description,price,image}=req.body;
    const courseId=req.params.courseId;
    try{
        const Updatecourse=await Course.findByIdAndUpdate(courseId,{
            coursename,
            description,
            price,
            image
        },{new:true});

        console.log(Updatecourse);

        if(Updatecourse){
            return res.status(200).json({msg:"Course updated successfully"})
        }
        else{
            return res.status(500).json({msg:"No such Course found"})            
        }
        }
    catch(e){
        return res.status(500).json({msg:"Error while updating course"+e})
    }
})




app.listen(PORT, () => {
    console.log("App is listening on port ", PORT);
});
