const express = require('express');


const GithubScraper = require("../lib/GithubScraper");

const githubScraper = new GithubScraper()
// Create a new router
const router = express.Router();

// Define a GET endpoint
router.get('/matchmaker', async (req, res) => {
  const { github } = req.query


  let result = true
  const user = github.split("@").join("").trim().toLowerCase()
  githubScraper.setUser(user)

  let data = null;
  try {
    data = await githubScraper.fetchMatchMakerData();
    console.log(JSON.stringify(data, null, 2))
  } catch(e) {
    console.log(e)
    result = false
  }

  res.json({ result, data })
});

// Export the router
module.exports = router;