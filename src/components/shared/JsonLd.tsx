export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NexaPay',
    url: 'https://nexapay.id',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://nexapay.id/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NexaPay',
    url: 'https://nexapay.id',
    logo: 'https://nexapay.id/icon.png',
    sameAs: [
      'https://instagram.com/nexapay',
      'https://twitter.com/nexapay',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
    </>
  );
}
