"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from '@/data/blog-posts';

export default function Blog() {
  const blogPosts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h1>
          
          <div className="grid gap-6">
            {blogPosts.map((post) => (
              <Link 
                href={`/blog/${post.slug}`} 
                key={post.slug}
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6 items-start">
                  <div className="relative h-48 w-48 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority={false}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/blog/default-post.svg';
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-2">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Disposable Temporary E-mail?</h2>
              <p className="text-gray-700 leading-relaxed">
                Disposable email - is a free email service that allows to receive email at a temporary address that self-destructed after a certain time elapses. It is also known by names like: tempmail, 10minutemail, 10minmail, throwaway email, fake-mail, fake email generator, burner mail or trash-mail.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Tech behind Disposable Email Addresses</h2>
              <p className="text-gray-700 leading-relaxed">
                Everyone owns an email address each and every hour, for everything from connecting at work, with business prospects, reaching out to friends and colleagues using the email address as an online passport. Nearly 99% of all apps and services we sign-up today required an email address.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 