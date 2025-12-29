import { MetadataRoute } from "next";
import { SITE, CALCULATORS } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE.baseUrl;
    const now = new Date();

    // Homepage
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 1.0,
        },
    ];

    // Calculator pages from config
    CALCULATORS.forEach((calc) => {
        routes.push({
            url: `${baseUrl}/${calc.id}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: calc.featured ? 0.9 : 0.8,
        });
    });

    return routes;
}
