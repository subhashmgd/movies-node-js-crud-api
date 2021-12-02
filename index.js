const express = require('express')
const app = express()
const port = 5000;

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

//static route
app.use("/images", express.static(__dirname + "/uploads"));


const validate_api_key = async (req, res, next) => {

  var api_key = req.headers["api-key"];

  //can me validated from database
  if (!api_key || api_key != "my-api-key") {

    return res.status(401).send({
      success: false,
      message: "access denied"
    });
  }
  else
    next();
}


//moview routes
app.use("/movies", validate_api_key, require("./routes/movies"));

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
