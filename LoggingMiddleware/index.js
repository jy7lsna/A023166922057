import "dotenv/config";
import fetch from "node-fetch";

const API_URL = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

/**
 * log message to the api
 * @param {string} stack - 'frontend' or 'backend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} pkg - package name (see allowed values)
 * @param {string} message - log message
 */
export async function Log(stack, level, pkg, message) {
  const body = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to log");
    }
    return data;
  } catch (error) {
    return { error: error.message };
  }
}
