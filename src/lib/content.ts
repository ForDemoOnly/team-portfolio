import { getCollection, getEntry } from 'astro:content';
import type { Project, SiteSettings, TeamMember } from './types';

const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  team_name: 'Your Team',
  tagline: 'A small team shipping thoughtful software.',
  about: null,
  contact_email: null,
  socials: {},
  updated_at: '',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const entry = await getEntry('site', 'default');
  if (!entry) return FALLBACK_SETTINGS;
  return {
    id: 1,
    team_name: entry.data.team_name,
    tagline: entry.data.tagline,
    about: entry.data.about ?? null,
    contact_email: entry.data.contact_email ?? null,
    socials: entry.data.socials ?? {},
    updated_at: '',
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const entries = await getCollection('team');
  return entries
    .map((e) => ({
      id: e.id,
      name: e.data.name,
      role: e.data.role,
      bio: (e.body ?? '').trim() || null,
      photo_url: e.data.photo ?? null,
      socials: e.data.socials ?? {},
      sort_order: e.data.sort_order ?? 0,
      created_at: '',
      updated_at: '',
    }))
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getProjects(options?: { featuredOnly?: boolean }): Promise<Project[]> {
  const entries = await getCollection('projects');
  let list: Project[] = entries.map((e) => ({
    id: e.id,
    slug: e.id,
    title: e.data.title,
    summary: e.data.summary,
    description: (e.body ?? '').trim() || null,
    image_url: e.data.image ?? null,
    link_url: e.data.link_url ?? null,
    tech_stack: e.data.tech_stack ?? [],
    featured: e.data.featured ?? false,
    sort_order: e.data.sort_order ?? 0,
    created_at: '',
    updated_at: '',
  }));
  list.sort((a, b) => a.sort_order - b.sort_order);
  if (options?.featuredOnly) list = list.filter((p) => p.featured);
  return list;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const entry = await getEntry('projects', slug);
  if (!entry) return null;
  return {
    id: entry.id,
    slug: entry.id,
    title: entry.data.title,
    summary: entry.data.summary,
    description: (entry.body ?? '').trim() || null,
    image_url: entry.data.image ?? null,
    link_url: entry.data.link_url ?? null,
    tech_stack: entry.data.tech_stack ?? [],
    featured: entry.data.featured ?? false,
    sort_order: entry.data.sort_order ?? 0,
    created_at: '',
    updated_at: '',
  };
}
