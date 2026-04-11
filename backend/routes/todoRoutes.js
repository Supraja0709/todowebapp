const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateCreateTodo, validateUpdateTodo } = require('../middleware/validateMiddleware');

// All todo routes are protected
router.use(authMiddleware);

router.get('/',    todoController.getTodos);
router.post('/',   validateCreateTodo, todoController.createTodo);
router.put('/:id', validateUpdateTodo, todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
