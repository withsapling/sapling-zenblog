import { html } from "@sapling/sapling";
import BlogLayout from "../layouts/BlogLayout.ts";
import { getPosts, getCategories } from "../lib/zenblogClient.ts";
import { formatDate } from "../lib/dates.ts";
import "../lib/types.ts";

type BlogCategoryProps = {
  params: {
    slug: string;
  };
};

export async function BlogCategory(props: BlogCategoryProps) {
  const { data: posts } = await getPosts();
  const { data: categories } = await getCategories();

  // Find the current category
  const currentCategory = categories.find(
    (category) => category.slug === props.params.slug
  );

  if (!currentCategory) {
    return html`<div>Category not found</div>`;
  }

  // Filter posts by category
  const categoryPosts = posts.filter(
    (post) => post.category && post.category.slug === props.params.slug
  );

  return await BlogLayout({
    title: `${currentCategory.name} - Blog`,
    description: `Posts in the ${currentCategory.name} category`,
    children: html`
      <div class="p-4 space-y-12">
        <div>
          <h1 class="md:text-3xl text-2xl font-bold mt-12">
            Category: ${currentCategory.name}
          </h1>
          <p class="text-slate-500 text-lg mt-2">
            Browse all posts in this category
          </p>
        </div>

        <!-- Categories Section -->
        <section class="flex flex-col gap-1">
          <ul class="flex gap-2">
            ${categories?.map(
              (category) => html`
                <li>
                  <a
                    class="px-3 font-medium ${category.slug ===
                    currentCategory.slug
                      ? "text-orange-600 bg-orange-50"
                      : "text-slate-800 hover:text-orange-600 bg-white"} py-2 border rounded-full"
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
          ${categoryPosts.length > 0
            ? categoryPosts.map(
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
                        <time class="text-sm font-medium text-slate-500"
                          >${formatDate(post.published_at)}</time
                        >
                      </div>
                      <a href="/blog/${post.slug}">
                        <h2 class="md:text-2xl text-xl font-bold">
                          ${post.title}
                        </h2>
                        <p class="text-slate-600 text-balance">
                          ${post.excerpt || ""}
                        </p>
                      </a>
                      ${post.authors?.length
                        ? html`
                            <div class="flex gap-2 mt-4">
                              ${post.authors.map(
                                (author) => html`
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
                                    <span
                                      class="text-sm font-medium text-slate-500"
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
              )
            : html`
                <div class="col-span-2 text-center py-12">
                  <h3 class="text-xl font-medium text-slate-600">
                    No posts found in this category
                  </h3>
                  <p class="mt-2">Check back later for new content</p>
                </div>
              `}
        </div>
      </div>
    `,
  });
}
