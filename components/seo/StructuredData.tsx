"use client";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RFX - Watch Beyond Borders",
    "alternateName": "RFX Streaming Platform",
    "url": "https://rfx.based.my.id",
    "logo": "https://rfx.based.my.id/logo.png",
    "description": "Premium streaming platform for Asian drama, anime, manga, and short videos with English and Indonesian subtitles.",
    "sameAs": [
      "https://rfx.based.my.id",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "url": "https://rfx.based.my.id/help"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RFX - Watch Beyond Borders",
    "url": "https://rfx.based.my.id",
    "description": "Stream latest Asian drama, anime episodes, read manga & komik online for free. Your ultimate entertainment destination.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://rfx.based.my.id/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RFX",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rfx.based.my.id/logo.png"
      }
    }
  };

  const entertainmentSchema = {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    "name": "RFX Streaming Platform",
    "image": "https://rfx.based.my.id/logo.png",
    "url": "https://rfx.based.my.id",
    "priceRange": "Free",
    "description": "Watch Korean drama, Japanese anime, Chinese series, Thai lakorn, read manga, manhwa, manhua online with HD quality and subtitles.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "description": "Free streaming service for drama, anime, and manga"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rfx.based.my.id"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Drama",
        "item": "https://rfx.based.my.id/drama"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Anime",
        "item": "https://rfx.based.my.id/anime"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Komik",
        "item": "https://rfx.based.my.id/komik"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Shorts",
        "item": "https://rfx.based.my.id/shorts"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entertainmentSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
