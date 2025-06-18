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

app.get("/", (req, res) => {
  res.send("Ciao da Docker Compose! App Node.js connessa a MongoDB.");
});

const startEnvironment = () => {
  connectDB(URI).then(() => {
    app.listen(PORT, () => {
      console.log(`Server in ascolto su http://localhost:${PORT}`);
    });
  });
};

startEnvironment();
