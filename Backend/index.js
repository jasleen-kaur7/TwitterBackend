const express = require("express");
const cors = require("cors");
const user = require("./Routes/UserRoute");
const tweet = require("./Routes/TweetRoute");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const PORT = 8000;

const app = express();

app.use(cors());
app.use(express.json());
console.log({user})
console.log({tweet})
app.use("/user", user);
app.use("/tweet", tweet);

app.listen(PORT, function () {
  console.log(`App listening at http://localhost:${PORT}`);
});
