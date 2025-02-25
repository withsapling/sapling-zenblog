import { html } from "@sapling/sapling";
import BlogLayout from "../layouts/BlogLayout.ts";
import { getPosts, getCategories } from "../lib/zenblogClient.ts";
import { formatDate } from "../lib/dates.ts";
import { Author, Post } from "../lib/types.ts"; // Import both Author and Post types
import { type SiteSettings } from "../index.ts";

export interface BlogProps {
  siteSettings: SiteSettings;
}

export async function Blog({ siteSettings }: BlogProps) {
  // Get posts and categories
  const { data: posts } = await getPosts();
  const { data: categories } = await getCategories();

  // Sort posts by publish date to get the latest post
  const lastPost = posts.sort((a, b) => {
    return (
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  })[0] as Post; // Cast to our Post type

  // Filter out the featured post from the remaining posts
  const postsWithoutLast = posts.filter(
    (post) => post.slug !== lastPost.slug
  ) as Post[];

  return await BlogLayout({
    title: siteSettings.title,
    description: siteSettings.description,
    siteSettings,
    children: html`
      <div class="p-4 space-y-12">
        <div>
          <h1 class="md:text-3xl text-2xl font-bold mt-12">Blog</h1>
          <p class="text-slate-500 text-lg mt-2">
            Stay up to date with the latest news and updates from the team!
          </p>
        </div>

        <!-- Featured Post -->
        <article class="md:flex group">
          <a
            href="/blog/${lastPost.slug}"
            class="flex-1 overflow-hidden rounded-xl"
          >
            <div class="overflow-hidden rounded-xl">
              <img
                src="${lastPost.cover_image}"
                alt="${lastPost.title}"
                height="400"
                width="400"
                class="w-full group-hover:scale-105 transition-all duration-300 object-cover max-h-[400px]"
              />
            </div>
          </a>
          <div class="md:max-w-sm flex-1 flex flex-col gap-2 mt-4 p-6">
            <div class="flex justify-between items-center">
              ${lastPost.category
                ? html`<a
                    href="/blog/categories/${lastPost.category.slug}"
                    class="text-orange-500 font-medium hover:underline"
                    >${lastPost.category.name}</a
                  >`
                : null}
              <time class="text-sm font-medium text-slate-500"
                >${formatDate(lastPost.published_at)}</time
              >
            </div>
            <a class="space-y-3 text-left" href="/blog/${lastPost.slug}">
              <h2 class="text-3xl md:text-4xl font-bold tracking-tighter">
                ${lastPost.title}
              </h2>
              <p class="text-slate-600 text-balance">
                ${lastPost.excerpt || ""}
              </p>
              ${lastPost.authors?.length
                ? html`
                    <div class="flex gap-2 mt-4">
                      ${lastPost.authors.map(
                        (author: Author) => html`
                          <div
                            class="flex gap-2 items-center text-sm font-medium text-slate-500"
                          >
                            <img
                              src="${author.image_url}"
                              alt="${author.name}"
                              width="32"
                              height="32"
                              class="w-8 h-8 rounded-full object-cover"
                            />
                            <span class="text-sm font-medium text-slate-500"
                              >${author.name}</span
                            >
                          </div>
                        `
                      )}
                    </div>
                  `
                : ""}
            </a>
          </div>
        </article>

        <!-- Categories Section -->
        <section class="flex flex-col gap-1">
          <ul class="flex gap-2">
            ${categories?.map(
              (category) => html`
                <li>
                  <a
                    class="px-3 font-medium text-slate-800 hover:text-orange-600 py-2 bg-white border rounded-full"
                    href="/blog/categories/${category.slug}"
                  >
                    ${category.name}
                  </a>
                </li>
              `
            ) || ""}
          </ul>
        </section>

        <!-- Grid of Posts -->
        <div class="grid md:grid-cols-2 gap-12">
          ${postsWithoutLast.map(
            (post) => html`
              <article>
                <a href="/blog/${post.slug}">
                  <img
                    height="230"
                    width="300"
                    class="rounded-lg object-cover w-full max-h-[230px]"
                    src="${post.cover_image}"
                    alt="${post.title}"
                  />
                </a>
                <div class="mt-2">
                  <div class="flex justify-between items-center">
                    ${post.category
                      ? html`<a
                          href="/blog/categories/${post.category.slug}"
                          class="text-orange-500 font-medium hover:underline"
                          >${post.category.name}</a
                        >`
                      : null}
                    <time class="text-sm font-medium text-slate-500"
                      >${formatDate(post.published_at)}</time
                    >
                  </div>
                  <a href="/blog/${post.slug}">
                    <h2 class="md:text-2xl text-xl font-bold">${post.title}</h2>
                    <p class="text-slate-600 text-balance">
                      ${post.excerpt || ""}
                    </p>
                  </a>
                  ${post.authors?.length
                    ? html`
                        <div class="flex gap-2 mt-4">
                          ${post.authors.map(
                            (author: Author) => html`
                              <div
                                class="flex gap-2 items-center text-sm font-medium text-slate-500"
                              >
                                <img
                                  src="${author.image_url}"
                                  alt="${author.name}"
                                  width="32"
                                  height="32"
                                  class="w-8 h-8 rounded-full object-cover"
                                />
                                <span class="text-sm font-medium text-slate-500"
                                  >${author.name}</span
                                >
                              </div>
                            `
                          )}
                        </div>
                      `
                    : ""}
                </div>
              </article>
            `
          )}
        </div>
      </div>
    `,
  });
}
