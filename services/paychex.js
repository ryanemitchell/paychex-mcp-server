const axios = require('axios');
const { getLLMService } = require('./llm');

/**
 * Base URL for Paychex API documentation
 */
const PAYCHEX_DOC_BASE_URL = 'https://developer.paychex.com/documentation';

/**
 * Fetch data from Paychex API documentation
 * @param {string} endpoint - Specific endpoint path to fetch from or null for base docs
 * @returns {Promise<Object>} The retrieved data
 */
async function getPaychexData(endpoint = '') {
  try {
    const url = endpoint ? `${PAYCHEX_DOC_BASE_URL}/${endpoint}` : PAYCHEX_DOC_BASE_URL;
    
    const headers = {};
    
    // Add authentication if available
    if (process.env.PAYCHEX_API_KEY) {
      headers['x-api-key'] = process.env.PAYCHEX_API_KEY;
    }
    
    if (process.env.PAYCHEX_CLIENT_ID && process.env.PAYCHEX_CLIENT_SECRET) {
      // For OAuth authentication, add appropriate headers
      // This is a placeholder - implement according to Paychex specific requirements
      headers['client-id'] = process.env.PAYCHEX_CLIENT_ID;
      // Note: typically you would get a token rather than passing the secret directly
    }
    
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching Paychex data:', error);
    throw new Error(`Failed to fetch Paychex data: ${error.message}`);
  }
}

/**
 * Process a query against Paychex data using the configured LLM
 * @param {string} query - The user's query
 * @param {string} endpoint - Optional specific endpoint to query against
 * @returns {Promise<string>} The LLM's response
 */
async function callLLMWithPaychexData(query, endpoint) {
  try {
    // Get the data from Paychex
    const paychexData = await getPaychexData(endpoint);
    
    // Get the appropriate LLM service based on configuration
    const llmService = getLLMService();
    
    // Construct the prompt with Paychex data and user query
    const prompt = `
      Using the following information from the Paychex API documentation, please answer the query.
      
      PAYCHEX DOCUMENTATION:
      ${JSON.stringify(paychexData, null, 2)}
      
      USER QUERY: ${query}
      
      Provide a clear and concise response based only on the information above.
    `;
    
    // Call the LLM with the constructed prompt
    const response = await llmService.generateResponse(prompt);
    return response;
  } catch (error) {
    console.error('Error processing query with LLM:', error);
    throw new Error(`Failed to process query: ${error.message}`);
  }
}

module.exports = {
  getPaychexData,
  callLLMWithPaychexData
};
