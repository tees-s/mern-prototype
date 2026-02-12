// 1. รายละเอียดในแต่ละส่วนของ Schema
const mongoose = require('mongoose');

// ออกแบบ Schema: กำหนดโครงสร้างและกฎ (Validation) ของข้อมูล
const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'กรุณาระบุชื่อเนื้อหางาน'], // ✅ Validation: ถ้าไม่ส่งค่านี้มา Database จะไม่บันทึกและแจ้งเตือนกลับไป
        trim: true // ✅ Data Cleaning: ลบช่องว่าง (Space) ส่วนเกินที่หัว/ท้ายข้อความออกให้เอง
    },
    description: { 
        type: String, 
        default: '' // ✅ Default Value: ถ้าผู้ใช้ไม่ได้ใส่คำอธิบาย ให้ค่าว่างเป็นค่าเริ่มต้นแทน null
    },
    status: { 
        type: String, 
        enum: ['pending', 'doing', 'done'], // ✅ Constraint: จำกัดค่าได้แค่ 3 อย่างนี้เท่านั้น (ช่วยป้องกันข้อมูลมั่ว)
        default: 'pending' // ✅ เริ่มต้นสถานะงานเป็น "รอดำเนินการ"
    },
    createdAt: { 
        type: Date, 
        default: Date.now // ✅ Timestamp: บันทึกวันเวลาที่สร้าง Document นี้อัตโนมัติ
    }
});

// 2. การนำไปใช้งาน
// สร้าง Model: เปรียบเสมือนการสร้างตัวแทน (Object) ที่เราจะใช้คุยกับ Database
// โดยระบุชื่อ Collection ว่า 'Task' (Mongoose จะไปสร้าง table ในชื่อ "tasks" ให้อัตโนมัติ)
const Task = mongoose.model('Task', taskSchema);

// ส่งออก Model เพื่อให้ไฟล์อื่น (เช่น index.js หรือ controller) เรียกใช้คำสั่ง .find(), .save() ได้
module.exports = Task;