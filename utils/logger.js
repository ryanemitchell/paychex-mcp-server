/**
 * Simple logger utility for the Paychex MCP server
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Set default log level from environment or use INFO
const currentLogLevel = process.env.LOG_LEVEL 
  ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] 
  : LOG_LEVELS.INFO;

/**
 * Log a message with specified level
 * @param {string} level - The log level
 * @param {string} message - The message to log
 * @param {Object} [data] - Optional data to include
 */
function log(level, message, data = null) {
  const logLevel = LOG_LEVELS[level.toUpperCase()];
  
  if (logLevel <= currentLogLevel) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message
    };
    
    if (data) {
      logEntry.data = data;
    }
    
    // In production, you might want to use a proper logging library
    // This is a simple console-based implementation
    console.log(JSON.stringify(logEntry));
  }
}

// Convenience methods for different log levels
const logger = {
  error: (message, data) => log('ERROR', message, data),
  warn: (message, data) => log('WARN', message, data),
  info: (message, data) => log('INFO', message, data),
  debug: (message, data) => log('DEBUG', message, data)
};

module.exports = logger;