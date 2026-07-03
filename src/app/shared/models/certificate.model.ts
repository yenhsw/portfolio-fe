// ============================================================
// CERTIFICATE MODEL
// Certification and achievement data model
// ============================================================

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issuerLogo: string;
  issuerUrl: string;
  description: string;
  credentialId: string;
  credentialUrl: string;
  skills: string[];
  issueDate: Date;
  expiryDate: Date | null;
  noExpiry: boolean;
  verificationStatus: VerificationStatus;
  order: number;
  featured: boolean;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  organization: string;
  organizationLogo: string;
  date: Date;
  type: AchievementType;
  order: number;
  createdAt: Date;
}

export type AchievementType = 'award' | 'recognition' | 'milestone' | 'contribution';
