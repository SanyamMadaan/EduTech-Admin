const express = require('express');
const { Admin, Course, Video } = require('./db');  // Ensure Video is imported
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authenticated_Admin = require('./middleware/authenticated');
const app = express();
const dotenv=require('dotenv');
dotenv.config();
const secret = process.env.secreat;
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

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
        return res.status(411).json({ msg: "Error while searching Admin: " + e });
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

app.delete('/delete/:courseID', async (req, res) => {
    const courseid = req.params.courseID;
    try {
        const deleteCourse = await Course.findById(courseid);
        if (deleteCourse) {
            await Course.deleteOne({ _id: deleteCourse._id });
            return res.status(200).json({ msg: "Course deleted Successfully" });
        }
        return res.status(500).json({ msg: "No course found" });
    } catch (e) {
        return res.status(500).json({ msg: "Error while deleting course: " + e });
    }
});

app.put('/update/:courseId', async (req, res) => {
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

app.post('/addcourse', async (req, res) => {
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

app.post('/addvideo', async (req, res) => {
    const { courseId, title, videoUrl } = req.body;
    if (!courseId || !title || !videoUrl) {
        return res.status(400).json({ msg: "Missing required fields: courseId, title, or videoUrl" });
    }

    try {
        const video = new Video({
            courseId,
            title,
            videoUrl
        });
        await video.save();
        res.status(201).send(video);
    } catch (error) {
        res.status(400).send({ msg: "Error adding video", error });
    }
});

app.get('/course/:courseId/videos', async (req, res) => {
    const { courseId } = req.params;
    try {
        const videos = await Video.find({ courseId });
        res.status(200).send(videos);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(PORT, () => {
    console.log("App is listening on port ", PORT);
});
