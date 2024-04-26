const URL = "mongodb+srv://sanyam:Sanyam%407820@cluster0.h0ddjdt.mongodb.net/Edutech_admin";
const mongoose=require('mongoose');

try{
    mongoose.connect(URL).then((response)=>{
        console.log('databse connected successfully');
    })    
}catch(e){
    console.log('error while connecting to database ',e);
}

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

const Admin = mongoose.model("Admin", AdminSchema);
const Course = mongoose.model("Course", CourseSchema);

module.exports = {
    Admin,
    Course,
};
