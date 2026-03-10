const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTodayTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getStats,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth); // All task routes require authentication

router.get('/', getTasks);
router.get('/today', getTodayTasks);
router.get('/stats', getStats);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/complete', completeTask);

module.exports = router;
