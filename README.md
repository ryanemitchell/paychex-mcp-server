# Paychex MCP Server

This project is a demonstration MCP (Machine Callable Program) server that interacts with the Paychex Developer API documentation. It allows integration with various LLMs (Language Learning Models) to process queries against Paychex documentation.

## Features

- Connect to Paychex Developer API documentation
- Support for multiple LLM providers (OpenAI, Anthropic, etc.)
- Environment-based configuration for secure key management
- RESTful API endpoints for querying Paychex data with LLMs

## Setup

1. Clone this repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file with your API keys

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
# Server configuration
PORT=3000

# Paychex API keys
PAYCHEX_API_KEY=your_api_key_here
PAYCHEX_CLIENT_ID=your_client_id_here
PAYCHEX_CLIENT_SECRET=your_client_secret_here

# LLM configuration
LLM_TYPE=openai  # Options: openai, anthropic, azure, etc.
LLM_API_KEY=your_llm_api_key_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

## Usage

### Development

```
npm run dev
```

### Production

```
npm start
```

## API Endpoints

### Get Paychex Data

```
GET /api/paychex/data?endpoint=optional_endpoint_path
```

Returns raw data from the Paychex API documentation.

### Query with LLM

```
POST /api/paychex/query
```

Body:
```json
{
  "query": "What are the available Paychex APIs?",
  "endpoint": "optional_endpoint_path"
}
```

Processes the query against Paychex documentation using the configured LLM.

## Extending

### Adding New LLM Providers

To add support for a new LLM provider:

1. Add a new service class in `services/llm.js`
2. Update the `getLLMService()` function to handle the new provider
3. Add the necessary environment variables to `.env.example`

## Disclaimer

This is a demonstration project only. It is not officially affiliated with or endorsed by Paychex.
