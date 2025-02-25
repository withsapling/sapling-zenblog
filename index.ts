import { Sapling, serveStatic, type Context } from "@sapling/sapling";
import NotFoundLayout from "./layouts/NotFoundLayout.ts";
import { Blog } from "./pages/Blog.ts";
import { BlogPost } from "./pages/BlogPost.ts";
import { BlogCategory } from "./pages/BlogCategory.ts";

const site = new Sapling({
  dev: Deno.env.get("ENV") === "development",
});

// Home page
site.get("/", async (c: Context) => c.html(await Blog()));

// Blog routes
site.get("/blog", async (c: Context) => c.html(await Blog()));
site.get("/blog/:slug", async (c: Context) =>
  c.html(await BlogPost({ params: { slug: c.req.param("slug") } }))
);
site.get("/blog/categories/:slug", async (c: Context) =>
  c.html(await BlogCategory({ params: { slug: c.req.param("slug") } }))
);

// Enter additional routes here

// Serve static files
// The location of this is important. It should be the last route you define.
site.get(
  "/*",
  serveStatic({
    root: "./static",
  })
);

// 404 Handler
site.notFound(async (c) => c.html(await NotFoundLayout()));

Deno.serve({
  port: 8080,
  onListen: () =>
    console.log(
      `\nSapling Server is running on %chttp://localhost:8080\n`,
      "color: green; font-weight: bold"
    ),
  handler: site.fetch,
});
