import winston from 'winston'; // Import the winston logging library

const logger = winston.createLogger({
  level: 'info', // Set default log level to 'info'
  format: winston.format.json(), // Format log output as JSON
  transports: [
    new winston.transports.Console(), // Output logs to the console
    // Output error-level logs to a file named 'error.log'
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Export the logger instance to be used in other files
export default logger;