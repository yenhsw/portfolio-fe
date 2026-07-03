// ============================================================
// PROFILE MODEL
// User profile data model
// ============================================================

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  subtitle: string;
  bio: string;
  shortBio: string;
  avatar: string;
  coverImage: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  cv: string;
  available: boolean;
  yearsOfExperience: number;
  completedProjects: number;
  happyClients: number;
  awards: number;
  socialLinks: ProfileSocialLink[];
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileSocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ProfileStats {
  yearsOfExperience: number;
  completedProjects: number;
  happyClients: number;
  awards: number;
}
