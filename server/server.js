const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Task Model
const Task = require('./models/Task');

const app = express();
const cors = require('cors');
app.use(express.json());

app.use(cors({
  origin: "https://mern-prototype.vercel.app/", // 👈 ใส่ URL หน้าเว็บ Vercel ของอาจารย์ตรงนี้
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// --- เพิ่มส่วนการเชื่อมต่อ Database ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.log("MongoDB connection error:", err));
// ---------------------------------

app.get('/test', (req, res) => {
    res.json({ message: "Backend & Database เชื่อมต่อสำเร็จ!" });
});

// [GET] ดึงรายการงานทั้งหมด
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // เรียงจากใหม่ไปเก่า
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// [POST] เพิ่มงานใหม่
app.post('/api/tasks', async (req, res) => {
    const newTask = new Task({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// [DELETE] ลบงานที่ต้องการ (ตาม ID)
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "ลบรายการเรียบร้อยแล้ว" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// [PUT] แก้ไขข้อมูล (เช่น เปลี่ยนสถานะงาน หรือแก้ไขชื่อชื่อ)
app.put('/api/tasks/:id', async (req, res) => {
    try {
        // findByIdAndUpdate จะหาข้อมูลตาม ID และอัปเดตด้วยข้อมูลจาก req.body
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // คืนค่าข้อมูลตัวที่อัปเดตใหม่กลับมา (ถ้าไม่ใส่จะคืนตัวเก่า)
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));