"use client";

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { articleSchema } from '@/utils/schema';
import Script from 'next/script';
import { getPostBySlug } from '@/data/blog-posts';
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const post = getPostBySlug(params.slug);

  // Handle non-existent posts
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
            <Link 
              href="/blog"
              className="text-blue-600 hover:underline"
            >
              Return to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Script
        id="ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema(post))
        }}
      />
      
      <Header />
      <main className="flex-grow bg-white py-12">
        <article className="max-w-4xl mx-auto px-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title and Meta */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 mb-8">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
            <span className="mx-2">•</span>
            <span>By {post.author}</span>
          </div>

          {/* Featured Image */}
          <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/blog/default-post.svg';
              }}
            />
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">About the Author</h2>
            <p className="text-gray-600">{post.authorBio}</p>
          </div>

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid gap-6">
                {post.relatedPosts.map((slug) => {
                  const relatedPost = getPostBySlug(slug);
                  if (!relatedPost) return null;
                  
                  return (
                    <Link 
                      href={`/blog/${relatedPost.slug}`}
                      key={relatedPost.slug}
                      className="group flex gap-4 items-start p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-24 w-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/blog/default-post.svg';
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{relatedPost.excerpt}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
