const db = require('../db');

exports.getTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks: ' + err.message });
  }
};

exports.createTodo = async (req, res) => {
  try {
    console.log('CreateTodo - User:', req.user);
    console.log('CreateTodo - Body:', req.body);
    const userId = req.user.id;
    const { title, priority, category, due_date } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const [result] = await db.query(
      'INSERT INTO todos (title, user_id, priority, category, due_date) VALUES (?, ?, ?, ?, ?)',
      [title, userId, priority || 'Medium', category || 'General', due_date || null]
    );

    const [newTask] = await db.query('SELECT * FROM todos WHERE id = ?', [Number(result.insertId)]);
    res.status(201).json(newTask[0]);
  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({ error: 'Failed to create task: ' + err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, is_completed, priority, category, due_date } = req.body;
    
    // Check ownership
    const [existing] = await db.query('SELECT * FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    
    const task = existing[0];
    const newTitle = title !== undefined ? title : task.title;
    const newCompleted = is_completed !== undefined ? is_completed : task.is_completed;
    const newPriority = priority !== undefined ? priority : task.priority;
    const newCategory = category !== undefined ? category : task.category;
    const newDueDate = due_date !== undefined ? due_date : task.due_date;
    
    await db.query(
      'UPDATE todos SET title = ?, is_completed = ?, priority = ?, category = ?, due_date = ? WHERE id = ?',
      [newTitle, newCompleted, newPriority, newCategory, newDueDate, id]
    );
    
    const [updatedTask] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
    res.json(updatedTask[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task: ' + err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const [result] = await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task: ' + err.message });
  }
};
