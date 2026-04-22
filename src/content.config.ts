import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const socials = z
  .object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    x: z.string().optional(),
    website: z.string().optional(),
    email: z.string().optional(),
  })
  .partial()
  .default({});

const site = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/site' }),
  schema: z.object({
    team_name: z.string(),
    tagline: z.string(),
    about: z.string().nullable().optional(),
    contact_email: z.string().nullable().optional(),
    socials,
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string().nullable().optional(),
    socials,
    sort_order: z.number().default(0),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    image: z.string().nullable().optional(),
    link_url: z.string().url().nullable().optional(),
    tech_stack: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    sort_order: z.number().default(0),
  }),
});

export const collections = { site, team, projects };
