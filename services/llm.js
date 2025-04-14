/**
 * LLM service factory - creates appropriate LLM service based on configuration
 */

class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt) {
    try {
      // This is a simplified implementation
      // In a real application, you would use the OpenAI SDK or API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant for Paychex API documentation.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}

class AnthropicService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt) {
    try {
      // This is a simplified implementation
      // In a real application, you would use the Anthropic SDK or API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-2',
          max_tokens: 1000,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }
}

// Add more LLM services as needed (e.g., Azure, Cohere, etc.)

/**
 * Factory function to get the appropriate LLM service based on configuration
 * @returns {Object} An instance of the configured LLM service
 */
function getLLMService() {
  const llmType = process.env.LLM_TYPE || 'openai';
  
  switch (llmType.toLowerCase()) {
    case 'openai':
      const openaiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
      if (!openaiKey) {
        throw new Error('OpenAI API key not configured');
      }
      return new OpenAIService(openaiKey);
      
    case 'anthropic':
      const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.LLM_API_KEY;
      if (!anthropicKey) {
        throw new Error('Anthropic API key not configured');
      }
      return new AnthropicService(anthropicKey);
      
    // Add more cases as needed
    
    default:
      throw new Error(`Unsupported LLM type: ${llmType}`);
  }
}

module.exports = {
  getLLMService
};
