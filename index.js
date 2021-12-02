const express = require('express')
const app = express()
const port = 5000;

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

//static route
app.use("/images", express.static(__dirname + "/uploads"));


//moview routes
app.use("/movies", require("./routes/movies"));

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
