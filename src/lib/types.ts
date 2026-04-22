export type Socials = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  x?: string;
  website?: string;
  email?: string;
  [key: string]: string | undefined;
};

export type SiteSettings = {
  id: number;
  team_name: string;
  tagline: string;
  about: string | null;
  contact_email: string | null;
  socials: Socials;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  socials: Socials;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  tech_stack: string[];
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
