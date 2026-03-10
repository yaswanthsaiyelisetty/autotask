const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    task: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      maxlength: 500,
    },
    date: {
      type: String, // YYYY-MM-DD format
      default: null,
    },
    time: {
      type: String, // HH:mm 24-hour format
      required: [true, 'Time is required'],
    },
    repeat: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none',
    },
    repeatDay: {
      type: String, // For weekly: "Monday", "Tuesday", etc. For monthly: "1"-"31"
      default: null,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'missed'],
      default: 'pending',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    lastReminderDate: {
      type: String, // YYYY-MM-DD – tracks the last date a recurring reminder was sent
      default: null,
    },
    source: {
      type: String,
      enum: ['web', 'whatsapp'],
      default: 'web',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient scheduler queries
taskSchema.index({ status: 1, time: 1, date: 1, reminderSent: 1 });

module.exports = mongoose.model('Task', taskSchema);
