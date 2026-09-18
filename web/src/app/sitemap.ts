import { MetadataRoute } from 'next';
import { SERVICEABLE_AREAS } from '@/data/service-areas';
import { SERVICES } from '@/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sheriyakam.in';

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/electrician-services-in-kozhikode`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Area landing pages
  SERVICEABLE_AREAS.forEach((area) => {
    const slug = area.areaName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    routes.push({
      url: `${baseUrl}/electrician-services-in-kozhikode/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // Service landing pages
  SERVICES.forEach((service) => {
    routes.push({
      url: `${baseUrl}/electrician-services/${service.slug || service.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return routes;
}
