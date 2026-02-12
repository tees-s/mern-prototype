// 1. ส่วนการ Import และ Setup เบื้องต้น
const express = require('express'); // ดึง Framework Express มาสร้าง Server
const mongoose = require('mongoose'); // ดึง Library Mongoose มาจัดการ MongoDB
const cors = require('cors'); // ใช้จัดการเรื่องความปลอดภัย (CORS) เพื่อให้ Frontend จาก Domain อื่นเรียกใช้ API ได้
require('dotenv').config(); // โหลดค่าตัวแปรสภาพแวดล้อมจากไฟล์ .env

// Import Model ที่เรานิยามไว้ (โครงสร้างตารางข้อมูล Task)
const Task = require('./models/Task');

const app = express(); // สร้าง Instance ของ Express เพื่อเริ่มสร้าง Server
app.use(express.json()); // บอกให้ Server อ่านข้อมูลที่เป็น JSON ได้ (ใช้ตอนรับข้อมูลจาก POST/PUT)


// 2. การตั้งค่า CORS และการเชื่อมต่อ Database
app.use(cors({
  origin: "https://mern-prototype.vercel.app/", // อนุญาตให้เฉพาะเว็บไซต์นี้เท่านั้นที่เรียกใช้ API ได้
  methods: ["GET", "POST", "PUT", "DELETE"], // กำหนด HTTP Methods ที่อนุญาต
  credentials: true // อนุญาตให้ส่ง Cookies หรือ Header ที่ต้องมีการยืนยันตัวตนได้
}));

// ดึงค่า URI จากไฟล์ .env มาใช้
const uri = process.env.MONGO_URI; 

// สั่งเชื่อมต่อ MongoDB โดยใช้ Promise (.then / .catch) เพื่อดูสถานะการเชื่อมต่อ
mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.log("MongoDB connection error:", err));


// 3. ส่วนของ API Endpoints (CRUD Operations)    
app.get('/api/tasks', async (req, res) => {
    try {
        // ใช้คำสั่ง .find() ดึงข้อมูลทั้งหมด และ .sort() เรียงลำดับตามวันที่สร้าง (ใหม่ -> เก่า)
        const tasks = await Task.find().sort({ createdAt: -1 }); 
        res.json(tasks); // ส่งผลลัพธ์กลับไปให้ Frontend ในรูปแบบ JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // หาก error ส่ง Code 500 (Server Error)
    }
});

app.post('/api/tasks', async (req, res) => {
    // สร้าง Object ใหม่จาก Model โดยดึงข้อมูลจาก req.body (สิ่งที่ Frontend ส่งมา)
    const newTask = new Task({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const savedTask = await newTask.save(); // บันทึกลง Database
        res.status(201).json(savedTask); // ส่งสถานะ 201 (Created) พร้อมข้อมูลที่บันทึกสำเร็จ
    } catch (err) {
        res.status(400).json({ message: err.message }); // หากข้อมูลผิดพลาด (เช่น ลืมใส่ Title) ส่ง Code 400
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        // ดึง ID จาก URL (:id) แล้วสั่งลบ Record นั้นทันที
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "ลบรายการเรียบร้อยแล้ว" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        // หาด้วย ID และอัปเดตด้วยข้อมูลใหม่ใน req.body
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // สำคัญ: เพื่อให้ตัวแปร updatedTask ได้ข้อมูล "หลังแก้" มาใช้งาน
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. ส่วนการเปิดใช้งาน Server
const PORT = process.env.PORT || 5000; // ใช้ Port จาก .env ถ้าไม่มีให้ใช้ Port 5000 เป็น Default
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));