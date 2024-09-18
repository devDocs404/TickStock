import { MiddlewareHandler } from "hono";

// Function to format messages with color
const formatMessage = (color: string, message: string) =>
  `\x1b[${color}m${message}\x1b[0m`;

// ASCII Art for Startup
const startupArt = `<-_-_-_-_-_-_-_-_-_-_-_-_->`;

const formatLog = (
  method: string,
  url: string,
  status: number,
  responseTime: number
) => `
${formatMessage("36", `[${new Date().toISOString()}]`)} ${formatMessage(
  "34",
  method
)} ${formatMessage("33", url)}
${formatMessage("32", `Status: ${status}`)} ${formatMessage(
  "90",
  `Response Time: ${responseTime}ms`
)}
`;

// Logger middleware
export const loggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  const { method, url } = c.req;

  // Log incoming request details
  console.log(formatLog(method, url, 0, 0)); // Initial log with placeholder status and response time

  // Execute the next middleware or route handler
  await next();

  // Calculate the response time
  const responseTime = Date.now() - start;
  const status = c.res.status;

  // Log response details
  console.log(formatLog(method, url, status, responseTime));
};
