import { Sapling, serveStatic, type Context } from "@sapling/sapling";
import NotFoundLayout from "./layouts/NotFoundLayout.ts";
import { Blog } from "./pages/Blog.ts";
import { BlogPost } from "./pages/BlogPost.ts";
import { BlogCategory } from "./pages/BlogCategory.ts";

// Default site settings
export const defaultSiteSettings = {
  title: "Sapling Zenblog",
  description: "A blog built with Sapling and Zenblog",
};

// Type for site settings
export type SiteSettings = typeof defaultSiteSettings;

// Function to create a site with custom settings
export function createSite(customSettings: Partial<SiteSettings> = {}) {
  // Merge default settings with custom settings
  const siteSettings = { ...defaultSiteSettings, ...customSettings };

  const site = new Sapling({
    dev: Deno.env.get("ENV") === "development",
  });

  // Home page
  site.get("/", async (c: Context) => c.html(await Blog({ siteSettings })));

  // Blog routes
  site.get("/blog", async (c: Context) => c.html(await Blog({ siteSettings })));
  site.get("/blog/:slug", async (c: Context) =>
    c.html(
      await BlogPost({ params: { slug: c.req.param("slug") }, siteSettings })
    )
  );
  site.get("/blog/categories/:slug", async (c: Context) =>
    c.html(
      await BlogCategory({
        params: { slug: c.req.param("slug") },
        siteSettings,
      })
    )
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
  site.notFound(async (c) => c.html(await NotFoundLayout({ siteSettings })));

  return { site, siteSettings };
}

// Export a default site instance for backward compatibility
export const { site, siteSettings } = createSite();
