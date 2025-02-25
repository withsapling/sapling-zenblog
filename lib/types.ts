// Types for the Zenblog API
export interface Author {
  name: string;
  slug: string;
  image_url: string;
  bio?: string;
}

export interface Category {
  name: string;
  slug: string;
}

// Define our Post interface with all needed properties
export interface Post {
  title: string;
  slug: string;
  published_at: string;
  cover_image: string;
  excerpt?: string;
  content?: string;
  category?: Category;
  authors?: Author[];
  [key: string]: any; // Allow for additional properties
}

// Also add type for the author parameter in map functions
export type PostWithAuthors = Post;
