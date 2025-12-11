// --------------------------- ↓ SETTING UP DEPENDENCIES ↓ --------------------------------
require("dotenv").config(); // loads env variables into server before going live
const express = require("express"); // Enables the use of Express.js
const cors = require("cors"); // Enables Cross Origin Resource Sharing
const mongoose = require("mongoose"); // Enables us to connect and interact with teh database




// ---------------------------- ↓ INITIAL APP CONFIGURATION ↓ -----------------------------

const port = process.env.PORT || 3000; // Uses port number on device to serve the backend
const app = express(); // Using Express.js to power our application/server



// -------------------------------- ↓ MIDDLEWARE SETUP ↓ -----------------------------------

app.use(express.json()); // uses express in JSON Format
app.use(cors("*")); // Enables use of CORS - * means every domain is now allowed acces to this server to send and receive data - not secure - * is for development only


// ---------------------- ↓ DATABASE CONNECTION + APP STARTUP ↓ ---------------------------

// Imediately Invoked Function Expression (IIFE)
(async () => {
  try {
    mongoose.set("autoIndex", false);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connected!");

    await Task.syncIndexes();
    console.log(`✅ Indexes created!`);
    
    app.listen(port, () => {
      console.log(`✅ To Do App is live on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err);
    process.exit(1);
  }
})();


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



// ---------------------------------- ↓ API ROUTES ↓ ---------------------------------------

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const { sortBy } = req.query;
    let sortOption = {};

    if (sortBy === "dueDate") {
      sortOption = { dueDate: 1 }; // ascending
    } else if (sortBy === "dateCreated") {
      sortOption = { dateCreated: 1 };
    }


    const tasks = await Task.find({}).sort(sortOption);

    if (!tasks) {
      return res.status(404).json({ message: "Tasks not found!" });
    }

    res.json(tasks);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error grabbing tasks!" });
  }
});





// Create a new task and add it to the array
app.post("/api/tasks/todo", async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const taskData = { title, description, dueDate };
    const createTask = new Task(taskData);
    const newTask = await createTask.save();

    res.json({ message: "Task created successfully!", task: newTask });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error creating task!" });
  }
});





// Complete the task 
app.patch("/api/tasks/complete/:id", async (req, res) => {
  try {
    const { completed } = req.body;
    const taskId = req.params.id;
    
    const completedTask = await Task.findByIdAndUpdate(taskId, { completed }, { new: true });

    if (!completedTask) {
      return res.status(404).json({ message: "Task not found!" });
    }

    res.json({ task: completedTask, message: "Task set to 'complete'" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error completing the task!" });
  }
});





// To make the task not complete
app.patch("/api/tasks/notComplete/:id", async (req, res) => {
  try {
    const { completed } = req.body;
    const taskId = req.params.id;
    
    const taskNotComplete = await Task.findByIdAndUpdate(taskId, { completed }, { new: true });

    if (!taskNotComplete) {
      return res.status(404).json({ message: "Task not found!" });
    }

    res.json({ task: taskNotComplete, message: "Task set to 'not complete'" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error making the task not complete!" });
  }
});





// To delete the task
app.delete("/api/tasks/delete/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found!" });
    }

    res.json({ task: deletedTask, message: "Task deleted successfully!" });
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error deleting the task!" });
  }
});





// to edit the task and update the details
app.put("/api/tasks/update/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, dueDate } = req.body;

    const taskData = { title, description, dueDate };
    const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found!" });
    }

    res.json({ task: updatedTask, message: "Task updated successfully!" })
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error updating the task!" });
  }
});

