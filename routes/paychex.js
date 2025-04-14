const express = require('express');
const { getPaychexData, callLLMWithPaychexData } = require('../services/paychex');

const router = express.Router();

// Route to get raw data from Paychex API
router.get('/data', async (req, res) => {
  try {
    const data = await getPaychexData(req.query.endpoint);
    res.json(data);
  } catch (error) {
    console.error('Error fetching Paychex data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to query Paychex data with an LLM
router.post('/query', async (req, res) => {
  try {
    const { query, endpoint } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const response = await callLLMWithPaychexData(query, endpoint);
    res.json({ response });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { paychexRoutes: router };
