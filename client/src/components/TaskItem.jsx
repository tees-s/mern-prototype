/**
 * Component TaskItem รับ Props มา 3 ตัว:
 * 1. task: ข้อมูลของงานแต่ละชิ้น (เช่น title, status, _id)
 * 2. onDelete: ฟังก์ชันสำหรับลบงาน (ส่งมาจาก App.js)
 * 3. onToggle: ฟังก์ชันสำหรับสลับสถานะ (ส่งมาจาก App.js)
 */
function TaskItem({ task, onDelete, onToggle }) {
  return (
    <li className="task-item">
      {/* ส่วนแสดงชื่อเนื้อหางาน */}
      <span 
        // 🔄 เมื่อคลิกที่ข้อความ ให้เรียกฟังก์ชัน onToggle เพื่อสลับสถานะ pending/done
        onClick={() => onToggle(task)}
        style={{ 
          // 🎨 ถ้าสถานะเป็น 'done' ให้ขีดฆ่าข้อความ (line-through) ถ้าไม่ใช่วางไว้ปกติ
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
          // ☝️ เปลี่ยนสัญลักษณ์เมาส์เป็นรูปมือเพื่อให้ผู้ใช้รู้ว่ากดได้
          cursor: 'pointer',
          // 📐 ขยายพื้นที่ให้กว้างที่สุดเพื่อความง่ายในการกด
          flex: 1
        }}
      >
        {task.title}
      </span>

      {/* 🗑️ ปุ่มลบงาน */}
      <button 
        // เมื่อคลิก จะเรียกฟังก์ชัน onDelete โดยส่ง ID ของงานนั้นๆ กลับไป
        onClick={() => onDelete(task._id)} 
        className="btn-delete"
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;