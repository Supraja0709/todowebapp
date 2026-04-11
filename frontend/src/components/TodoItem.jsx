import { useState } from 'react';
import { IoCheckmark, IoTrashOutline, IoPencilOutline, IoCloseOutline, IoSaveOutline, IoCalendarOutline } from 'react-icons/io5';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDueDateStatus(dateStr, isCompleted) {
  if (!dateStr || isCompleted) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const due   = new Date(dateStr); due.setHours(0,0,0,0);
  const diff  = Math.round((due - today) / 86400000);
  if (diff < 0)  return { label: `Overdue by ${Math.abs(diff)}d`, cls: 'due--overdue' };
  if (diff === 0) return { label: 'Due Today',  cls: 'due--today' };
  if (diff <= 3)  return { label: `Due in ${diff}d`, cls: 'due--soon' };
  return { label: formatDate(dateStr), cls: 'due--normal' };
}

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle]   = useState(todo.title);

  const handleEdit = () => {
    if (isEditing) {
      if (newTitle.trim() && newTitle !== todo.title) onEdit(todo.id, newTitle.trim());
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setNewTitle(todo.title);
    }
  };

  const handleCancel = () => { setIsEditing(false); setNewTitle(todo.title); };

  const dueStatus = getDueDateStatus(todo.due_date, todo.is_completed);
  const isOverdue = dueStatus?.cls === 'due--overdue';

  return (
    <div className={`todo-item ${todo.is_completed ? 'completed' : ''} ${isOverdue ? 'todo-item--overdue' : ''}`}>
      <div className="todo-check" onClick={() => onToggle(todo.id, todo.is_completed)}>
        <div className={`checkbox ${todo.is_completed ? 'checked' : ''}`}>
          {todo.is_completed && <IoCheckmark size={18} />}
        </div>
      </div>

      <div className="todo-content">
        {isEditing ? (
          <input
            type="text"
            className="edit-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(); if (e.key === 'Escape') handleCancel(); }}
            autoFocus
            maxLength={255}
          />
        ) : (
          <div className="todo-content-wrapper">
            <span className="todo-text">{todo.title}</span>
            <div className="todo-meta">
              <span className={`priority-tag ${todo.priority.toLowerCase()}`}>{todo.priority}</span>
              <span className="category-tag">{todo.category}</span>
              {dueStatus && (
                <span className={`due-tag ${dueStatus.cls}`}>
                  <IoCalendarOutline size={11} />
                  {dueStatus.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button className="action-btn save-btn" onClick={handleEdit} title="Save"><IoSaveOutline size={18} /></button>
            <button className="action-btn cancel-btn" onClick={handleCancel} title="Cancel"><IoCloseOutline size={18} /></button>
          </>
        ) : (
          <>
            <button className="action-btn edit-btn" onClick={handleEdit} title="Edit task"><IoPencilOutline size={18} /></button>
            <button className="action-btn delete-btn" onClick={() => onDelete(todo.id)} title="Delete task"><IoTrashOutline size={18} /></button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;
