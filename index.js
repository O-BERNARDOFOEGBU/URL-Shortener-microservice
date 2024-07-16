require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// URL Shortener Microservice Endpoints
app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  // Validate URL format
  const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+(\/\S*)?$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  // Validate DNS
  const urlObj = new URL(originalUrl);
  dns.lookup(urlObj.hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    // Generate short_url (simulate for demo)
    const shortUrl = Math.floor(Math.random() * 1000);

    // Store original_url and short_url (simulate for demo)
    const shortUrlMap = {
      original_url: originalUrl,
      short_url: shortUrl,
    };

    // Respond with the stored data
    res.json(shortUrlMap);
  });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = req.params.short_url;

  // Lookup the original_url based on short_url (simulate for demo)
  // In a real app, this would involve querying a database
  const originalUrl = "https://freeCodeCamp.org"; // Simulated data

  // Redirect to the original_url
  res.redirect(originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
