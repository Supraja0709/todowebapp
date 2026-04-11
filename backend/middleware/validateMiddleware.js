// ── Validation helpers ────────────────────────────────────────────────────────

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidDate  = (d)     => !isNaN(Date.parse(d));

// ── Auth validators ───────────────────────────────────────────────────────────

exports.validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2)
    errors.push('Name must be at least 2 characters.');
  if (!email || !isValidEmail(email))
    errors.push('A valid email address is required.');
  if (!password || password.length < 6)
    errors.push('Password must be at least 6 characters.');

  if (errors.length > 0)
    return res.status(400).json({ error: errors.join(' ') });

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email))
    errors.push('A valid email address is required.');
  if (!password)
    errors.push('Password is required.');

  if (errors.length > 0)
    return res.status(400).json({ error: errors.join(' ') });

  next();
};

// ── Todo validators ───────────────────────────────────────────────────────────

exports.validateCreateTodo = (req, res, next) => {
  const { title, priority, due_date } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0)
    errors.push('Task title is required.');
  if (title && title.trim().length > 255)
    errors.push('Title must be 255 characters or fewer.');
  if (priority && !['Low', 'Medium', 'High'].includes(priority))
    errors.push('Priority must be Low, Medium, or High.');
  if (due_date && !isValidDate(due_date))
    errors.push('Invalid due date format.');

  if (errors.length > 0)
    return res.status(400).json({ error: errors.join(' ') });

  next();
};

exports.validateUpdateTodo = (req, res, next) => {
  const { title, priority, due_date } = req.body;
  const errors = [];

  if (title !== undefined && title.trim().length === 0)
    errors.push('Task title cannot be empty.');
  if (title && title.trim().length > 255)
    errors.push('Title must be 255 characters or fewer.');
  if (priority !== undefined && !['Low', 'Medium', 'High'].includes(priority))
    errors.push('Priority must be Low, Medium, or High.');
  if (due_date !== undefined && due_date !== null && !isValidDate(due_date))
    errors.push('Invalid due date format.');

  if (errors.length > 0)
    return res.status(400).json({ error: errors.join(' ') });

  next();
};
