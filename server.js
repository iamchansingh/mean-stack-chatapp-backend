const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./config/secrets");
var fs = require('fs')
var https = require('https')
const app = express();
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET",
    "POST",
    "DELETE",
    "PUT",
    "OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,x-Requested-With, Content-Type,Accept,Authorization"
  );
  next();
});
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
mongoose.Promise = global.Promise;
mongoose.connect(
  dbConfig.url,
  { useNewUrlParser: true }
);
const auth = require("./routes/authRoutes");
app.use("/api/chatapp", auth);

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert")
    },
    app
  )
  .listen(3000, () => {
    console.log("running babes");
  });
