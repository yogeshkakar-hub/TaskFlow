const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route   GET api/tasks
// @desc    Get all tasks for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving tasks' });
  }
});

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      status: status || 'To Do',
      user: req.user.id
    });

    const task = await newTask.save();
    
    // Emit socket event for real-time updates
    const io = req.app.get('socketio');
    if (io) {
      io.emit('taskCreated', task);
    }

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// @route   PUT api/tasks/:id
// @desc    Update task status or details
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, status } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    // Emit socket event for real-time updates
    const io = req.app.get('socketio');
    if (io) {
      io.emit('taskUpdated', task);
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error updating task' });
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await task.deleteOne();

    // Emit socket event for real-time updates
    const io = req.app.get('socketio');
    if (io) {
      io.emit('taskDeleted', { id: req.params.id, userId: req.user.id });
    }

    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;
