// Types for the Zenblog API
export interface Author {
  name: string;
  slug: string;
  image_url: string;
  bio?: string;
}

// We need to make sure TypeScript recognizes our extensions to the zenblog types
declare module "zenblog" {
  interface Post {
    authors?: Author[];
  }

  interface PostWithContent {
    authors?: Author[];
  }
}

// Also add type for the author parameter in map functions
export type PostWithAuthors = {
  authors?: Author[];
  [key: string]: any;
};
