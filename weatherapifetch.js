const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const WeatherData = require("./models/WeatherData");

const app = express();

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

app.use(bodyParser.json());

// Connect to the MongoDB database
mongoose.connect("mongodb://127.0.0.1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database connected");
}).catch((error) => {
  console.error("db error", error);
  process.exit(1);
});
mongoose.set("strictQuery", true);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Modify the /:city route to fetch the weather data from the OpenWeatherMap API and store it in the database
app.get("/:city", async (req, res) => {
  const date = new Date();
  const day = date.getDate();
  const prime = isPrime(day);

  if (prime) {
    const API_KEY = "02cde9eacbdafde51e78d11fa089556d";
    const city = req.params.city;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
   
    const response = await fetch(weatherApiUrl);
    const data = await response.json();


    // Save the weather data to the database
    let temperature = null;
    let humidity = null;
    let windSpeed = null;

    try {
      temperature = data.main.temp;
      humidity = data.main.humidity;
      windSpeed = data.wind.speed;
    } catch (error) {
      console.error(error);
    }

    const weatherData = new WeatherData({
      city: data.name,
      temperature,
      humidity,
      windSpeed,
    });
    await weatherData.save().catch((err) => console.error(err));

    // Return the weather data to the client
    res.send(data);
  } else {
    // Return an error if the day is not prime
    res.status(400).send("Date is not prime so no data");
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
