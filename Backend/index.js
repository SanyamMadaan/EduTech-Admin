const express = require('express');
const cors = require('cors');
const CourseRouter=require('./routes/CourseRouter');
const AdminRouter=require('./routes/AdminRouter');
const UserRouter=require('./routes/UserRouter')
const dotenv=require('dotenv');
dotenv.config();
const PORT = process.env.PORT;
const bodyParser=require('body-parser');
const app = express();

const corsOptions = {
    origin: 'https://edu-tech-client-murex.vercel.app', // Replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow credentials if needed (e.g., cookies)
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))


app.use('/admin',AdminRouter)
app.use('/course',CourseRouter);
app.use('/User',UserRouter); 
  
app.listen(PORT, () => {
    console.log("App is listening on port ", PORT);
});
