export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  authorBio: string;
  coverImage: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: string;
  relatedPosts?: string[];
}

export const blogPosts: Record<string, BlogPost> = {
  '20-min-vs-10min': {
    slug: '20-min-vs-10min',
    title: "Why 20 Minutes is Better Than 10 for Temporary Emails",
    date: "2024-03-20",
    author: "Privacy Expert",
    authorBio: "Email security researcher with 10+ years of experience",
    coverImage: "/blog/20min-vs-10min.jpg",
    excerpt: "Discover why a 20-minute window provides the perfect balance between security and usability for temporary emails.",
    content: `...`,
    tags: ["email privacy", "temporary email", "digital security", "online privacy"],
    readTime: "5 min read"
  },
  // Add more blog posts here
};

export const getAllPosts = () => Object.values(blogPosts);
export const getPostBySlug = (slug: string) => blogPosts[slug]; 