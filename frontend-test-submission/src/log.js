const API_URL = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

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