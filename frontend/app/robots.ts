import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ratemyoutfit.app';
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/upload'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
