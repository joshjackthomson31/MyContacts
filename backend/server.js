const express = require("express");
const cors = require("cors");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

connectDb();
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors());

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

// Connect to DB first, then start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});