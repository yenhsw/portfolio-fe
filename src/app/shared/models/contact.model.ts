// ============================================================
// CONTACT MODEL
// Contact form and message data model
// ============================================================

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  status: MessageStatus;
  read: boolean;
  replied: boolean;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageStatus = 'new' | 'read' | 'replied' | 'archived';

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  availability: string;
  responseTime: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}
