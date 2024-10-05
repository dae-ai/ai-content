// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require('dotenv').config();

// const app = express();

// // Middleware to handle JSON payloads and static files
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(express.static('public')); // Serving static files from the "public" folder

// // Check for API_KEY in the environment
// if (!process.env.API_KEY) {
//   console.error("API_KEY is missing from the environment variables");
//   process.exit(1); // Exit if API_KEY is not provided
// }

// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // Function to generate content using Google Generative AI
// const generate = async (prompt) => {
//   try {
//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (err) {
//     console.error("Error generating content:", err);
//     throw err; // Propagate the error to handle it in the route
//   }
// };

// // POST route to handle content generation
// app.post('/api/content', async (req, res) => {
//   try {
//     const { question } = req.body;

//     // Validate input
//     if (!question || question.trim() === "") {
//       return res.status(400).json({ error: "Prompt cannot be empty." });
//     }

//     const result = await generate(question);
//     res.json({ Result: result || 'No content generated.' });
//   } catch (err) {
//     res.status(500).json({ error: err.toString() });
//   }
// });

// // GET route to serve the index.html file
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve only the HTML file
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public')); // Serving static files from the "public" folder

// Check for API_KEY in the environment
if (!process.env.API_KEY) {
  console.error("API_KEY is missing from the environment variables");
  process.exit(1); // Exit if API_KEY is not provided
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate content using Google Generative AI
const generate = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    let content = result.response.text();

    // Remove all asterisks (*) from the content using regex
    content = content.replace(/\*/g, '');

    return content;
  } catch (err) {
    console.error("Error generating content:", err);
    throw err; // Propagate the error to handle it in the route
  }
};

// POST route to handle content generation
app.post('/api/content', async (req, res) => {
  try {
    const { question } = req.body;

    // Validate input
    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Prompt cannot be empty." });
    }

    const result = await generate(question);
    res.json({ Result: result || 'No content generated.' });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// GET route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve only the HTML file
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
