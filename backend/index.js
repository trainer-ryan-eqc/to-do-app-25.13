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

const corsOptions = {
  origin: "https://to-do-app-25-13-three.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions)); // Enables use of CORS - * means every domain is now allowed acces to this server to send and receive data - not secure - * is for development only


// ---------------------------------------- ROUTES ----------------------------------------

const taskRoutes = require("./routes/taskRoutes");

app.use("/api/tasks", taskRoutes);


// ---------------------- ↓ DATABASE CONNECTION + APP STARTUP ↓ ---------------------------

// Imediately Invoked Function Expression (IIFE)
(async () => {
  try {
    mongoose.set("autoIndex", false);
    const Task = require("./models/task");

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

