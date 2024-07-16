# URL Shortener Microservice

This project is a URL Shortener Microservice built with Node.js and Express. It shortens long URLs into concise, easy-to-share links.

## Table of Contents

Live Demo
Features
Usage
API Endpoints
Setup and Installation
Examples
Technologies Used
License

## Live Demo

You can see the live demo of the project here.

## Features

Converts long URLs into short, easy-to-share links.
Validates URLs before generating short links.
Redirects users to the original URL when accessing the short link.
Usage
To use the microservice, you can interact with the specified API endpoints.

## API Endpoints

POST /api/shorturl/new

Requires a JSON object with the key "url" containing the original URL to shorten.
Response: JSON object with "original_url" and "short_url" properties.
GET /api/shorturl/:short_url

Redirects to the original URL corresponding to the :short_url provided.
Response
For successful shortening request (POST /api/shorturl/new):

```json
{
  "original_url": "<original_url>",
  "short_url": "<short_url>"
}
```

For redirection (GET /api/shorturl/:short_url), redirects to the original URL.

If an invalid URL format is provided, the response will be:

```json
{
  "error": "invalid url"
}
```

## Setup and Installation

Prerequisites
Node.js
npm (Node Package Manager)
Installation
Clone the repository:

git clone https://github.com/your-username/url-shortener-microservice.git
cd url-shortener-microservice
Install dependencies:

npm install
Running the Microservice
Start the server:

npm start
The server will start on port 3000 by default. You can access the microservice at http://localhost:3000.

Examples
Shorten a URL
Request:

POST /api/shorturl/new
Content-Type: application/json

{
"url": "https://www.freecodecamp.org"
}
Response:

```json
{
  "original_url": "https://www.freecodecamp.org",
  "short_url": "1"
}
```

Access a Shortened URL
Request:

GET /api/shorturl/1
Response:
Redirects to https://www.freecodecamp.org.

## Technologies Used

Node.js
Express
npm
MongoDB (optional, for storing mappings between short URLs and original URLs)

## License

This project is licensed under the MIT License
