const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

app.use(express.json());

app.use("/api/user", authRoutes);
app.use("/api/posts", postRoutes);

main()
  .catch((err) => console.log(err))
  .then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  });
async function main() {
  await mongoose.connect(process.env.DB_CONNECT);
}
