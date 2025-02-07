import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { notFound } from "next/navigation";
import Image from "next/image";

const blogContent = {
  "why-use-temporary-email": {
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
  },
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogContent[params.slug as keyof typeof blogContent];

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <article className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-gray-600">{post.date} • {post.author}</p>
          <div className="mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
