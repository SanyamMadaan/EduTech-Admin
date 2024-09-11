const express=require('express');
const {Admin,Video,Course}=require('../db');
const router=express.Router();
const dotenv=require('dotenv');
dotenv.config();
const secret=process.env.secret;
const jwt=require('jsonwebtoken');
const authenticated_Admin=require('../middleware/authenticated');

router.post('/login', async (req, res) => {
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

module.exports=router;