import type { MetadataRoute } from "next";
import { SITE, CALCULATORS } from "./site-config";

const baseUrl = SITE.baseUrl;

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 1,
        },
    ];

    const calculatorPages = CALCULATORS.map((calc) => ({
        url: `${baseUrl}/${calc.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: calc.featured ? 0.9 : 0.8,
    }));

    return [...staticPages, ...calculatorPages];
}
