const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HistoricalData = require("./models/HistoricalData");

const app = express();

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

// Define a route to fetch the historical weather data for a city and store it in the database
app.get("/history/:city", async (req, res) => {
  try {
    const API_KEY = "YOUR_API_KEY";
    const city = req.params.city;
    const historyApiUrl = `https://api.openweathermap.org/data/2.5/history?q=${city}&appid=${API_KEY}`;

    const response = await fetch(historyApiUrl);
    const data = await response.json();

    // Save the weather data to the database
    const historicalData = new HistoricalData({
      city: data.city,
      data: data.list.map((item) => ({
        temperature: item.main.temp,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        timestamp: item.dt_txt
      }))
    });
    await historicalData.save().catch((err) => console.error(err));

    // Return the weather data to the client
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
