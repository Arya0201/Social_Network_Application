const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const port = 5000


mongoose.connect("mongodb://localhost:27017/socialnetwork")
  .then(() => {
    console.log("mongodb is connected");
  }).catch((err) => {
    console.log("Error in connection of mongodb");
  })


app.use(cors());
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/message"));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})