import { useState } from 'react';
import { IoAdd, IoFlagOutline, IoFolderOutline, IoCalendarOutline, IoAlertCircleOutline } from 'react-icons/io5';

function TodoForm({ onAdd }) {
  const [title, setTitle]       = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate]   = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError]       = useState('');

  const validate = () => {
    if (!title.trim()) return 'Task title cannot be empty.';
    if (title.trim().length > 255) return 'Title must be 255 characters or fewer.';
    if (dueDate) {
      const today = new Date(); today.setHours(0,0,0,0);
      if (new Date(dueDate) < today) return 'Due date cannot be in the past.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    onAdd({ title: title.trim(), priority, category: category.trim() || 'General', due_date: dueDate || null });
    setTitle(''); setCategory(''); setPriority('Medium'); setDueDate(''); setIsExpanded(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="todo-form-container">
      {error && (
        <div className="form-error">
          <IoAlertCircleOutline size={16} />
          {error}
        </div>
      )}
      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (error) setError(''); }}
          onFocus={() => setIsExpanded(true)}
          maxLength={255}
          id="task-title-input"
        />
        <button type="submit" className="add-btn" aria-label="Add task">
          <IoAdd size={28} />
        </button>
      </form>

      {isExpanded && (
        <div className="form-extras">
          <div className="extra-item">
            <IoFlagOutline />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} id="task-priority">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="extra-item">
            <IoFolderOutline />
            <input
              type="text"
              placeholder="Category (e.g. Math)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              id="task-category"
            />
          </div>
          <div className="extra-item">
            <IoCalendarOutline />
            <input
              type="date"
              value={dueDate}
              min={today}
              onChange={(e) => setDueDate(e.target.value)}
              id="task-due-date"
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoForm;
