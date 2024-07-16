require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const mongoose = require("mongoose");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// MongoDB Atlas connection string (replace with your MongoDB URI)
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Remove useCreateIndex from here
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define URL schema and model
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true, unique: true },
});

const UrlModel = mongoose.model("Url", urlSchema);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));

// Serve index.html
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// POST endpoint to create short URL
app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  // Validate URL format
  const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+(\/\S*)?$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  // Validate DNS
  const urlObj = new URL(originalUrl);
  dns.lookup(urlObj.hostname, async (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    try {
      // Check if URL already exists in the database
      let urlEntry = await UrlModel.findOne({ original_url: originalUrl });

      if (!urlEntry) {
        // Generate short_url (incremental for demo, replace with your logic)
        const count = await UrlModel.countDocuments();
        const shortUrl = count + 1;

        // Create new URL entry in database
        urlEntry = new UrlModel({
          original_url: originalUrl,
          short_url: shortUrl,
        });
        await urlEntry.save();
      }

      // Respond with the stored data
      res.json({
        original_url: urlEntry.original_url,
        short_url: urlEntry.short_url,
      });
    } catch (error) {
      console.error("Error creating short URL:", error);
      res.status(500).json({ error: "server error" });
    }
  });
});

// GET endpoint to redirect short URL to original URL
app.get("/api/shorturl/:short_url", async function (req, res) {
  const shortUrl = req.params.short_url;

  try {
    // Lookup the original_url based on short_url
    const urlEntry = await UrlModel.findOne({ short_url: shortUrl });

    if (!urlEntry) {
      return res.json({ error: "invalid short_url" });
    }

    // Redirect to the original_url
    res.redirect(urlEntry.original_url);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ error: "server error" });
  }
});

// Start server
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
