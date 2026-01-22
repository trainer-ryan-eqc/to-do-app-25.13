const mongoose = require("mongoose");


// Define the task schema (data structure)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  dateCreated: { type: Date, required: true, default: Date.now },
  completed: { type: Boolean, required: true, default: false }
});


// Definei ndexes for performance optimisation and sorting
taskSchema.index({ dueDate: 1 });
taskSchema.index({ dateCreated: 1 });


// Type of data structure to be used in database
const Task = mongoose.model("Task", taskSchema);


module.exports = Task;