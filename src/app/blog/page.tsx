"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";
import Image from "next/image";

const blogPosts = [
  {
    slug: "private-domains-guide",
    title: "Private domains. How to get your own Temporary Email (2024)",
    excerpt: "How to create temporary email on your own private domain and how it helps you to bypass common issues with registrations.",
    date: "2024-03-20",
    coverImage: "/blog/private-domain.svg",
    author: "TempMail Team",
  },
  {
    slug: "sms-verification",
    title: "How to receive SMS otp verification online in 5 min. Guide. (2024)",
    excerpt: "In this guide, we'll detail how to use a temporary phone number to receive one-time password (OTP) verification code texts to register for online services.",
    date: "2024-03-14",
    coverImage: "/blog/sms-verify.svg",
    author: "TempMail Security",
  },
  {
    slug: "android-app",
    title: "New Temp Mail app for Android (2024)",
    excerpt: "Read about the new features of Temp Mail mobile app for Android smartphones and tablets.",
    date: "2024-03-12",
    coverImage: "/blog/android-app.svg",
    author: "TempMail Dev",
  },
  {
    slug: "mobile-games",
    title: "Using Temp Mail for Mobile Game Registrations",
    excerpt: "Mobile games are perfect when you have some spare time. Learn how to use temporary email for quick and secure game registrations.",
    date: "2024-03-10",
    coverImage: "/blog/mobile-games.svg",
    author: "TempMail Gaming",
  },
  {
    slug: "ransomware-protection",
    title: "Protect Against Ransomware with Temporary Email",
    excerpt: "Learn how temporary email addresses can help protect you from ransomware and other email-based threats.",
    date: "2024-03-08",
    coverImage: "/blog/ransomware.svg",
    author: "TempMail Security",
  },
  {
    slug: "social-media-privacy",
    title: "Using Temp Mail for Social Media Registration",
    excerpt: "Keep your primary email private when signing up for social media. Use temporary email for safer social media experiences.",
    date: "2024-03-06",
    coverImage: "/blog/social-media.svg",
    author: "TempMail Privacy",
  },
  {
    slug: "why-use-temporary-email",
    title: "TempMail: Why 20 Minutes is the Sweet Spot",
    excerpt: "Discover why TempMail's 20-minute window provides the perfect balance between security and usability.",
    date: "2024-03-20",
    coverImage: "/blog/20min-vs-10min.svg",
    author: "TempMail Team",
  },
  {
    slug: "email-privacy-tips",
    title: "10 Ways to Use TempMail for Better Privacy",
    excerpt: "Master these essential TempMail tips to maximize your online privacy and security.",
    date: "2024-03-14",
    coverImage: "/blog/email-privacy.svg",
    author: "TempMail Privacy",
  },
  {
    slug: "temporary-email-for-developers",
    title: "TempMail API: A Developer's Guide",
    excerpt: "Complete guide for developers on integrating and using TempMail services in their applications.",
    date: "2024-03-12",
    coverImage: "/blog/developer-guide.svg",
    author: "TempMail Dev",
  },
  {
    slug: "fight-spam-with-temp-email",
    title: "Stop Spam with TempMail",
    excerpt: "How to effectively use TempMail to keep your primary inbox spam-free.",
    date: "2024-03-10",
    coverImage: "/blog/anti-spam.svg",
    author: "TempMail Security",
  },
  {
    slug: "instant-registration",
    title: "Instant Signups with TempMail",
    excerpt: "Quick guide to using TempMail for instant service registrations without compromising your privacy.",
    date: "2024-03-08",
    coverImage: "/blog/instant-registration.svg",
    author: "TempMail Team",
  },
  {
    slug: "protect-inbox-with-temp-email",
    title: "Shield Your Inbox with TempMail",
    excerpt: "Learn how TempMail acts as a protective barrier for your primary email address.",
    date: "2024-03-06",
    coverImage: "/blog/inbox-protection.svg",
    author: "TempMail Security",
  },
  {
    slug: "permanent-link-feature",
    title: "TempMail's Semi-Permanent Email Feature",
    excerpt: "Discover our unique semi-permanent email feature that gives you extended control over your temporary inbox.",
    date: "2024-03-04",
    coverImage: "/blog/permanent-link.svg",
    author: "TempMail Product",
  },
  {
    slug: "temp-email-marketing",
    title: "TempMail for Smart Marketing",
    excerpt: "How marketers can leverage temporary email services for better campaign testing and analysis.",
    date: "2024-03-02",
    coverImage: "/blog/marketing-weapon.svg",
    author: "TempMail Marketing",
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Popular Articles</h1>
          
          <div className="grid gap-6">
            {blogPosts.map((post) => (
              <Link 
                href={`/blog/${post.slug}`} 
                key={post.slug}
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6 items-start">
                  <div className="relative h-64 w-full bg-gray-100">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-contain p-4"
                      priority
                      onError={(e) => {
                        // Fallback to a default image if the specified image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = '/blog/default-post.svg';
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
                      {post.title}
                    </h2>
                    <p className="text-gray-600">{post.excerpt}</p>
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