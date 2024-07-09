require('dotenv').config();
console.log(process.env.DATABASE_URL); // Debugging line
const URL = process.env.DATABASE_URL;
const mongoose = require('mongoose');

async function ConnectToDatabase() {
    try {
        const res = await mongoose.connect(URL);
        console.log(`Connected to database`);
    } catch (e) {
        console.log('Error while connecting to Database ' + e);
    }
}

ConnectToDatabase();

const AdminSchema = mongoose.Schema({
    email: String,
    password: String,
});

const CourseSchema = mongoose.Schema({
    coursename: String,
    description: String,
    price: Number,
    image: String,
});

const VideoSchema = mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: String,
    videoUrl: String,
});

const Admin = mongoose.model("Admin", AdminSchema);
const Course = mongoose.model("Course", CourseSchema);
const Video = mongoose.model("Video", VideoSchema);

module.exports = {
    Admin,
    Course,
    Video
};
