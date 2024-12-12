import createClient, { Middleware } from "openapi-fetch";

import type { paths } from "./v1";

const client = createClient<paths>({
  baseUrl: "http://localhost:8080",
});

const middleware: Middleware = {
  async onResponse({ response }) {
    if (!response.body || response.body === null) {
      // Handle empty response bodies
      console.error("Empty response received.");
      return response; // Return the Response object as-is for now
    }

    try {
      // Attempt to parse the JSON body if present
      const clonedResponse = response.clone(); // Clone response for safe reading
      const body = await clonedResponse.json();
      console.log("Response body:", body);
      return response; // Optionally return the original Response object
    } catch (err) {
      console.error("Error parsing response body:", err);
      return response; // Ensure fallback to the original Response
    }
  },
};

client.use(middleware);
