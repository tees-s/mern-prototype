function TaskItem({ task, onDelete, onToggle }) {
  return (
    <li className="task-item">
      <span 
        onClick={() => onToggle(task)}
        style={{ 
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
          cursor: 'pointer',
          flex: 1
        }}
      >
        {task.title}
      </span>
      <button onClick={() => onDelete(task._id)} className="btn-delete">
        Delete
      </button>
    </li>
  );
}

export default TaskItem;