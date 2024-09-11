const express=require('express');
const {Course,User}=require('../db');
const router=express.Router();
const dotenv=require('dotenv');
const Razorpay=require('razorpay');
dotenv.config();
const secret=process.env.secret;
const crypto=require('crypto');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

router.use(express.json()); // Parses JSON bodies


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email, password });
      if (existingUser) {
        const userId = existingUser._id;
        console.log("userId while logging in ", userId);
        const token = jwt.sign({ userId }, secret);
        console.log(token);
        return res.status(200).json({ token: token });
      }
      return res.status(400).json({ msg: "No user exists for entered email" });
    } catch (e) {
      console.error("Error while logging in:", e);
      res.status(400).json({ msg: "Error while logging in" });
    }
  });
  
router.post("/signup", async (req, res) => {
    const { email, contact, password } = req.body;
    if(!email || !contact || !password){
      return res.status(400).json({msg:"Please fill all the fields"});
    }
    if(contact.length<10 || contact.length>10){
      return res.status(411).json({msg:"Conatct length should be 10"});
    }
    console.log("session started");
    const session=await mongoose.startSession();

    try {
      session.startTransaction();
      console.log('inside try block');
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('existing user');
        await session.abortTransaction();
        session.endSession();
        return res.status(411).json({ msg: "User already exists" });
      }
      const newUser = await User.create({ email, contact, password });
      console.log('user saved in database');
      const userId = newUser._id;
      const token = jwt.sign({ userId }, secret);
      
      console.log("userId from signup ", userId);
      console.log(token);
      
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ token: token });
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error while signing up:", e);
      res.status(500).json({ msg: "Error while signing up" });
    }
  });
  
router.get("/purchases", async (req, res) => {
  console.log('token received');
    const token = req.headers.authorization;
    try {
      console.log('inside try');
      const decoded = jwt.verify(token.split(" ")[1], secret);
      const userId = decoded.userId;
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ msg: "User not found" });
      }
      const purchasedCourses = await Course.find({
        _id: { $in: existingUser.courses },
      });
      res.status(200).json(purchasedCourses);
    } catch (error) {
      console.error("Error while fetching purchased courses:", error);
      res.status(500).json({
        msg: "Error while fetching purchased courses",
        error: error.message,
      });
    }
  });

router.get("/getApiKey", (req, res) => {
    const key = process.env.RAZORPAY_API_KEY;
    res.status(200).json({ key });
  });

  router.post("/purchase/:courseId", async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.body.userId;
    console.log("User ID is: " + userId);

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }

        const price = course.price;
        console.log("Course price: " + price);

        // Razorpay order options
        const options = {
            amount: Number(price * 100), // amount in the smallest currency unit (paise)
            currency: "INR",
        };

        // Create the order in Razorpay
        const order = await instance.orders.create(options);
        console.log("Created order: ", order);

        return res.status(200).json({
            price,
            success: true,
            order, // send order info to the frontend
        });
    } catch (error) {
        console.error("Error in purchase route:", error);
        return res.status(500).json({ msg: "Course not found or internal error" });
    }
});


router.post("/verifypayment", async (req, res) => {
  try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, userId } = req.body;

      // Step 1: Verify the payment signature
      const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
          .update(razorpay_order_id + "|" + razorpay_payment_id)
          .digest('hex');

      if (expectedSignature === razorpay_signature) {
          // Step 2: Payment is verified, find the user
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({ msg: 'User not found' });
          }

          // Step 3: Add the course to the user's `courses` array if not already added
          if (!user.courses.includes(courseId)) {
              user.courses.push(courseId);
              await user.save();
          }

          // Step 4: Send success response
          return res.status(200).json({ success: true, msg: 'Payment verified and course added' });
      } else {
          // If the signature does not match
          return res.status(400).json({ success: false, msg: 'Payment verification failed' });
      }
  } catch (error) {
      console.error("Error in payment verification:", error);
      return res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
});

  module.exports=router;