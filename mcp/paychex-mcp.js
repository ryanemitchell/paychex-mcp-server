/**
 * Paychex MCP (Machine Callable Program) definition
 * This file defines the MCP interface for Paychex API documentation
 */

const logger = require('../utils/logger');
const { getPaychexData, callLLMWithPaychexData } = require('../services/paychex');

/**
 * MCP specification for Paychex API documentation
 */
const paychexMCP = {
  name: "paychex-docs-mcp",
  description: "MCP for querying Paychex API documentation",
  version: "1.0.0",
  
  // Define the MCP interface schema
  schema: {
    type: "object",
    properties: {
      actions: {
        type: "object",
        properties: {
          getDocumentation: {
            type: "function",
            description: "Get documentation for Paychex APIs",
            parameters: {
              type: "object",
              properties: {
                endpoint: {
                  type: "string",
                  description: "Optional specific endpoint path to get documentation for"
                }
              },
              required: []
            },
            returns: {
              type: "object",
              description: "The Paychex API documentation"
            }
          },
          
          queryDocumentation: {
            type: "function",
            description: "Query the Paychex API documentation with natural language",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The natural language query about Paychex APIs"
                },
                endpoint: {
                  type: "string",
                  description: "Optional specific endpoint to query against"
                }
              },
              required: ["query"]
            },
            returns: {
              type: "string",
              description: "Answer to the query based on Paychex documentation"
            }
          }
        }
      }
    }
  },
  
  // Implement the actions
  actions: {
    // Get raw documentation
    getDocumentation: async (params = {}) => {
      try {
        logger.info("Fetching Paychex documentation", { endpoint: params.endpoint || "base" });
        const data = await getPaychexData(params.endpoint);
        return data;
      } catch (error) {
        logger.error("Error in getDocumentation", { error: error.message });
        throw new Error(`Failed to get Paychex documentation: ${error.message}`);
      }
    },
    
    // Query documentation with LLM
    queryDocumentation: async (params) => {
      try {
        if (!params.query) {
          throw new Error("Query parameter is required");
        }
        
        logger.info("Querying Paychex documentation", { 
          query: params.query, 
          endpoint: params.endpoint || "base" 
        });
        
        const response = await callLLMWithPaychexData(params.query, params.endpoint);
        return response;
      } catch (error) {
        logger.error("Error in queryDocumentation", { error: error.message });
        throw new Error(`Failed to query Paychex documentation: ${error.message}`);
      }
    }
  }
};

module.exports = paychexMCP;