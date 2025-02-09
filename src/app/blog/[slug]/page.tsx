"use client";

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { articleSchema } from '@/utils/schema';
import { Head } from "next/head";
import Script from 'next/script';
import type { Metadata } from 'next'

// This would come from your CMS or data source
const blogPosts = {
  '20-min-vs-10min': {
    title: "Why 20 Minutes is Better Than 10 for Temporary Emails",
    date: "2024-03-20",
    author: "Privacy Expert",
    authorBio: "Email security researcher with 10+ years of experience",
    coverImage: "/blog/20min-vs-10min.jpg",
    excerpt: "Discover why a 20-minute window provides the perfect balance between security and usability for temporary emails.",
    tags: ["email privacy", "temporary email", "digital security", "online privacy"],
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="lead text-xl text-gray-600 mb-8">
          In the fast-paced world of digital services, timing is everything. While the industry standard has been set at 10 minutes for temporary email services, our research and user feedback have consistently shown that 20 minutes provides the optimal balance between security and functionality.
        </p>
        <h2>The Science Behind the 20-Minute Window</h2>
        <p>Our research shows that...</p>
      </div>
    `,
    readTime: "5 min read",
    relatedPosts: ['another-post-slug']
  }
};

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts[params.slug];
  
  return {
    title: `${post.title} | Temp-emails Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    }
  }
}

export default function BlogPost({ params }: Props) {
  const post = blogPosts[params.slug];

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
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <article className="max-w-4xl mx-auto px-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
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
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={600}
            className="rounded-lg mb-8"
            priority
          />

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Bio */}
          <div className="bg-white rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">About the Author</h2>
            <p className="text-gray-600">{post.authorBio}</p>
          </div>

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              {/* Add related posts grid here */}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
