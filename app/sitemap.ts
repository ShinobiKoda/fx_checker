import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://fx-checker-pied.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'always', // Currency rates change frequently
      priority: 1,
    },
  ]
}
