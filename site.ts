import { createSite } from "./index.ts";

// Create a site with custom settings
const { site } = createSite({
  title: "My Site",
  description: "A customized blog built with Sapling and Zenblog",
});

Deno.serve({
  port: 8080,
  onListen: () => console.log("Server is running on http://localhost:8080"),
  handler: site.fetch,
});
