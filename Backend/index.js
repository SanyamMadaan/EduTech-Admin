const express = require('express');
const { Admin, Course, Video } = require('./db');  // Ensure Video is imported
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authenticated_Admin = require('./middleware/authenticated');
const app = express();
const dotenv=require('dotenv');
dotenv.config();
const secret = process.env.secreat;
const PORT = process.env.PORT;
const Razorpay = require("razorpay");


app.use(cors());
app.use(express.json());

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

app.post('/login', async (req, res) => {
    console.log(req.body);
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

app.get('/course/:courseId', async (req, res) => {
    try {
        const courseId=req.params.courseId;
        const courses = await Course.findById(courseId);
        if (courses) {
            return res.status(200).json(courses);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error fetching courses" });
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

app.delete('/delete/:courseID',authenticated_Admin, async (req, res) => {
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

app.delete('/course/:courseId/videos/:vid',authenticated_Admin,async(req,res)=>{
    const videoUrl=req.params.vid;
    console.log("video id is "+videoUrl);
    console.log('before try block');
    try{
        const videoToBeDeleted=await Video.findById(videoUrl);
        console.log('video founded inside try');
        console.log('video founded from database '+videoToBeDeleted);
        if(videoToBeDeleted){
            await Video.deleteOne({_id:videoToBeDeleted});
            return res.status(200).json({msg:"Video deleted successfully"});
        }
       return res.status(500).json({msg:"No such video founded"}); 
    }catch(e){
        console.log('inside catch');
        console.log(e);
        return res.status(500).json({msg:"Error while deleting video: "+e});
    }
})

app.put('/update/:courseId',authenticated_Admin, async (req, res) => {
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

app.post('/addcourse', authenticated_Admin, async (req, res) => {
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

//need to check
app.post('/addvideo',authenticated_Admin, async (req, res) => {
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

app.get("/getApiKey", (req, res) => {
    const key = process.env.RAZORPAY_API_KEY;
    res.status(200).json({ key });
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

app.post("/purchase/:courseId", async (req, res) => {
    const courseId = req.params.courseId;
    const userId=req.body.userId;
    console.log("user id is "+userId );
  
    try {
      const course = await Course.findOne({
        _id: courseId,
      });
      console.log("course is"+course);
      if(!course){
        return res.status(404).json({ msg: "Course not found" });
      }
      const price=course.price;
      console.log("price is "+price);
      //order options
      const options = {
        amount: Number(price * 100), // amount in the smallest currency unit
        currency: "INR",
      };
      //creating order
      const order = await instance.orders.create(options);
      console.log("order is"+order);
  
      res.status(200).json({
        price,
        success: true,
        order,
      });
    } catch (e) {
      console.log("dikkat aa gyi" +e);
      return res.status(500).json({ msg: "Course not found or internal error" });
    }
  });

app.post("/verifypayment",(req, res) => {
    //add course to user databse and verify the payment
    app.post('/verifypayment', async (req, res) => {
      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId } = req.body;
    
        // Step 1: Verify the payment
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
          .update(razorpay_order_id + "|" + razorpay_payment_id)
          .digest('hex');
    
        if (expectedSignature === razorpay_signature) {
          // Step 2: Payment is verified
          // Find the user by userId
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ msg: 'User not found' });
          }
    
          // Step 3: Add the course to the user's courses array
          user.courses.push(courseId);
          await user.save();  // Save the updated user document
    
          // Step 4: Send success response
          return res.status(200).json({ success: true, msg: 'Payment verified and course added' });
        } else {
          // If the signature does not match, the payment is not verified
          return res.status(400).json({ success: false, msg: 'Payment verification failed' });
        }
      } catch (error) {
        console.error("Error in payment verification", error);
        return res.status(500).json({ success: false, msg: 'Internal Server Error' });
      }
    });
    
  });

app.listen(PORT, () => {
    console.log("App is listening on port ", PORT);
});
