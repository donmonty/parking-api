const express = require("express");
const cors = require('cors');

const app = express();

const search = require("./routes/search")

app.use(cors({ origin: true }));
app.use(express.json());

app.use((req, res, next) => {
  //4200 para Angular y 3000 para React
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// app.use("/", (req, res) => {
//   res.send("Hello World!")
// })

app.use("/api/search", search);



app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = app;