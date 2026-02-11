import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import './App.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (title) => {
    await axios.post(API_URL, { title });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`${API_URL}/${task._id}`, {
      status: task.status === 'pending' ? 'done' : 'pending'
    });
    fetchTasks();
  };

  // กรองข้อมูลซ้อนกัน 2 ชั้น: 1. กรองคำค้นหา 2. กรองสถานะ
  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="App">
      <h1>Task Master (MERN)</h1>

      {/* ส่วนค้นหา (เดิม) */}
      <input 
        placeholder="🔍 ค้นหางาน..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* --- ส่วนปุ่ม Filter ตามสถานะ (ใหม่) --- */}
      <div className="filter-buttons" style={{ margin: '1rem 0', display: 'flex', gap: '5px' }}>
        {['all', 'pending', 'done'].map((status) => (
          <button 
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              flex: 1,
              fontSize: '0.8rem',
              backgroundColor: filterStatus === status ? '#646cff' : '#eee',
              color: filterStatus === status ? 'white' : '#555'
            }}
          >
            {status === 'all' ? 'ทั้งหมด' : status === 'pending' ? 'ค้างอยู่' : 'เสร็จแล้ว'}
          </button>
        ))}
      </div>

      <TaskInput onAdd={addTask} />

      <ul className="task-list">
        {filteredTasks.map(task => (
          <TaskItem key={task._id} task={task} onDelete={deleteTask} onToggle={toggleTask} />
        ))}
      </ul>
    </div>
  );
}

export default App;