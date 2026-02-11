const mongoose = require('mongoose');

// ออกแบบ Schema (หน้าตาข้อมูล)
const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'กรุณาระบุชื่อเนื้อหางาน'], // บังคับใส่ข้อมูล
        trim: true // ตัดช่องว่างหน้า-หลังให้อัตโนมัติ
    },
    description: { 
        type: String, 
        default: '' 
    },
    status: { 
        type: String, 
        enum: ['pending', 'doing', 'done'], // กำหนดค่าที่ยอมรับได้เท่านั้น
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now // บันทึกเวลาที่สร้างอัตโนมัติ
    }
});

// สร้าง Model จาก Schema เพื่อนำไปใช้งาน
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;