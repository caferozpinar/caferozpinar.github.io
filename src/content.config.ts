import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		locale: z.enum(['tr', 'en']),
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		metaTitle: z.string(),
		metaDescription: z.string(),
		ogImage: z.string().optional(),
		githubUrl: z.string().url().optional(),
		draft: z.boolean().default(false),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
	schema: z.object({
		locale: z.enum(['tr', 'en']),
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedAt: z.coerce.date().optional(),
		technologies: z.array(z.string()),
		status: z.enum(['active', 'completed', 'paused']).default('active'),
		githubUrl: z.string().url().optional(),
		demoUrl: z.string().url().optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog, projects };
