require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { paychexRoutes } = require('./routes/paychex');
const paychexMCP = require('./mcp/paychex-mcp');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/paychex', paychexRoutes);

// MCP endpoint
app.get('/mcp', (req, res) => {
  // Return the MCP schema description
  res.json({
    name: paychexMCP.name,
    description: paychexMCP.description,
    version: paychexMCP.version,
    schema: paychexMCP.schema
  });
});

// MCP action endpoint
app.post('/mcp/:action', async (req, res) => {
  const { action } = req.params;
  const params = req.body;
  
  logger.info(`MCP action requested: ${action}`, { params });
  
  // Check if the action exists
  if (!paychexMCP.actions[action]) {
    logger.error(`Invalid MCP action: ${action}`);
    return res.status(400).json({ error: `Invalid action: ${action}` });
  }
  
  try {
    // Execute the MCP action
    const result = await paychexMCP.actions[action](params);
    res.json({ result });
  } catch (error) {
    logger.error(`Error executing MCP action: ${action}`, { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  logger.info(`Paychex MCP Server running on port ${PORT}`);
});
