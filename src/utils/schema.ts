export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Temp-emails",
  "url": "https://tempfreeemail.com",
  "description": "Secure temporary email service for privacy protection and spam reduction",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tempfreeemail.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Temp-emails",
  "url": "https://tempfreeemail.com",
  "logo": "https://tempfreeemail.com/logo.png",
  "sameAs": [
    "https://github.com/yourusername",
    "https://twitter.com/yourusername"
  ]
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Temp-emails",
  "description": "Temporary email service that provides disposable email addresses",
  "provider": {
    "@type": "Organization",
    "name": "Temp-emails"
  },
  "serviceType": "Email Service",
  "areaServed": "Worldwide",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export const articleSchema = (article: any) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.excerpt,
  "image": article.coverImage,
  "datePublished": article.date,
  "author": {
    "@type": "Person",
    "name": article.author
  }
}); 