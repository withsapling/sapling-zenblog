import { html, raw } from "@sapling/sapling";
import BlogLayout from "../layouts/BlogLayout.ts";
import { getPostBySlug } from "../lib/zenblogClient.ts";
import { formatDate } from "../lib/dates.ts";
import "../lib/types.ts";
import { Author } from "../lib/types.ts";
import { type SiteSettings } from "../index.ts";

type BlogPostProps = {
  params: {
    slug: string;
  };
  siteSettings: SiteSettings;
};

export async function BlogPost(props: BlogPostProps) {
  const { data: post } = await getPostBySlug(props.params.slug);
  const { siteSettings } = props;

  if (!post) {
    return html`<div>Post not found</div>`;
  }

  return await BlogLayout({
    title: post.title,
    description: post.excerpt,
    siteSettings,
    children: html`
      <article class="mx-auto mt-8 space-y-12 px-6">
        <header class="max-w-2xl mx-auto space-y-8">
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
          <div class="text-center space-y-2">
            <h1 class="text-4xl md:text-6xl font-bold tracking-tighter">
              ${post.title}
            </h1>
            <p class="text-xl text-slate-600 text-balance">
              ${post.excerpt ?? ""}
            </p>
            ${post.authors?.length
              ? html`
                  <div class="flex gap-4 justify-center mt-4">
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
        </header>
        <img
          height="600"
          width="600"
          class="rounded-lg object-cover w-full max-h-[540px] mt-8"
          src="${post.cover_image}"
          alt="${post.title}"
        />
        <section class="prose prose-lg md:prose-xl mx-auto">
          <div>${raw(post.html_content)}</div>
        </section>
      </article>
    `,
  });
}
