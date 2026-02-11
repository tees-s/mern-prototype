import { useState } from 'react';

function TaskInput({ onAdd }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    onAdd(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="input-group">
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="เพิ่มงานใหม่..."
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskInput;