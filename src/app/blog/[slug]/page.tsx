"use client";

import Image from "next/image"; // ✅ Added missing import
import Header from "../components/Header";
import Footer from "../components/Footer";
import EmailGenerator from "../components/EmailGenerator"; // ✅ Added missing import

const blogPost = {
  title: "Why 20 Minutes is Better Than 10 for Temporary Emails",
  date: "2024-03-20",
  author: "Privacy Expert",
  coverImage: "/blog/20min-vs-10min.jpg",
  excerpt: "Discover why a 20-minute window provides the perfect balance between security and usability for temporary emails.",
  tags: ["email privacy", "temporary email", "digital security", "online privacy"],
  content: `
    <div class="prose prose-lg max-w-none">
      <p class="lead text-xl text-gray-600 mb-8">
        In the fast-paced world of digital services, timing is everything. While the industry standard has been set at 10 minutes for temporary email services, our research and user feedback have consistently shown that 20 minutes provides the optimal balance between security and functionality.
      </p>
    </div>
  `,
};

export default function BlogPost() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <article className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blogPost.title}</h1>
          <p className="text-gray-600">{blogPost.date} • {blogPost.author}</p>
          <Image
            src={blogPost.coverImage}
            alt={blogPost.title}
            width={800}
            height={400}
            className="rounded-lg my-4"
          />
          <div className="mt-8" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
