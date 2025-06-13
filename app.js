const express = require("express");
const connectDB = require("./db/connect");
require("dotenv").config();

const userRoutes = require("./routes/users");

const app = express();
const URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// routes
app.use("/api/users", userRoutes);

const startEnvironment = async () => {
  try {
    await connectDB(URI);
    app.listen(PORT, () => {
      console.log(`Server in ascolto su http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Errore di connessione al database:", error);
  }
};

startEnvironment();
