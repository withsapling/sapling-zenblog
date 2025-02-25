import { html, type LayoutProps } from "@sapling/sapling";
import Layout, { type BaseLayoutProps } from "./Layout.ts";
import { BLOG_TITLE } from "../lib/constants.ts";

export type BlogLayoutProps = BaseLayoutProps;

export default async function BlogLayout(props: BlogLayoutProps) {
  return await Layout({
    ...props,
    children: html`
      <div class="bg-slate-50">
        <div class="max-w-5xl mx-auto">
          <nav
            class="p-4 border-b border-slate-200 flex justify-between items-center"
          >
            <a class="text-lg font-semibold" href="/">${BLOG_TITLE}</a>
            <a href="/">Home</a>
          </nav>
          ${props.children}
          <footer class="p-12 text-center border-t mt-12">
            <p>
              Go write something!
              <a class="underline" href="https://zenblog.com">Zenblog.com</a>
            </p>
          </footer>
        </div>
      </div>
    `,
  });
}
