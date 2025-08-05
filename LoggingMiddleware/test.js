import { Log } from "./index.js";

async function testLogging() {
  const result = await Log(
    "frontend",
    "info",
    "api",
    "Test log from middleware"
  );
  console.log(result); 
}

testLogging();
