const Task = require('../models/Task');
const { getDateTimeParts } = require('../utils/dateTime');

// GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, date, sort } = req.query;
    const filter = { userId: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (date) filter.date = date;

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const tasks = await Task.find(filter).sort({ createdAt: sortOrder });

    res.json({ tasks, count: tasks.length });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/today
exports.getTodayTasks = async (req, res, next) => {
  try {
    const { date: today, dayName, dayOfMonth } = getDateTimeParts(req.user.timezone);

    const tasks = await Task.find({
      userId: req.user._id,
      status: 'pending',
      $or: [
        { date: today, repeat: 'none' },
        { repeat: 'daily' },
        { repeat: 'weekly', repeatDay: dayName },
        { repeat: 'monthly', repeatDay: dayOfMonth },
      ],
    }).sort({ time: 1 });

    res.json({ tasks, count: tasks.length });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { task, date, time, repeat, repeatDay, priority } = req.body;
    const { date: today } = getDateTimeParts(req.user.timezone);

    const newTask = await Task.create({
      userId: req.user._id,
      task,
      date: date || today,
      time,
      repeat: repeat || 'none',
      repeatDay: repeatDay || null,
      priority: priority || 'medium',
      source: 'web',
    });

    res.status(201).json({ task: newTask });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const { task, date, time, repeat, repeatDay, priority, status } = req.body;

    const existing = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!existing) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task !== undefined) existing.task = task;
    if (date !== undefined) existing.date = date;
    if (time !== undefined) existing.time = time;
    if (repeat !== undefined) existing.repeat = repeat;
    if (repeatDay !== undefined) existing.repeatDay = repeatDay;
    if (priority !== undefined) existing.priority = priority;
    if (status !== undefined) existing.status = status;

    // Reset reminderSent if time or date changed
    if (time !== undefined || date !== undefined) {
      existing.reminderSent = false;
    }

    await existing.save();

    res.json({ task: existing });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/complete
exports.completeTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = 'completed';
    await task.save();

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/stats
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Use collection.countDocuments with filter for Cosmos DB compatibility
    const total = await Task.find({ userId }).countDocuments();
    const pending = await Task.find({ userId, status: 'pending' }).countDocuments();
    const completed = await Task.find({ userId, status: 'completed' }).countDocuments();
    const highPriority = await Task.find({ userId, priority: 'high', status: 'pending' }).countDocuments();

    res.json({ total, pending, completed, highPriority });
  } catch (error) {
    next(error);
  }
};
