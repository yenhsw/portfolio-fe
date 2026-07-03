// ============================================================
// MESSAGE MODELS
// Messages Management Data Types
// ============================================================

export type MessageStatus = 'new' | 'read' | 'archived' | 'deleted' | 'spam';
export type MessagePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MessageFolder = 'inbox' | 'unread' | 'starred' | 'archived' | 'trash' | 'spam' | 'draft';

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface MessageReply {
  id: string;
  content: string;
  sentAt: string;
  isAdmin: boolean;
}

export interface Message {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  priority: MessagePriority;
  status: MessageStatus;
  isStarred: boolean;
  isRead: boolean;
  folder: MessageFolder;
  attachments: MessageAttachment[];
  replies: MessageReply[];
  createdAt: string;
  updatedAt: string;
}

export interface MessageFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  priority: MessagePriority;
}

export const MESSAGE_STATUSES: { value: MessageStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: '#10B981' },
  { value: 'read', label: 'Read', color: '#6366F1' },
  { value: 'archived', label: 'Archived', color: '#78716C' },
  { value: 'deleted', label: 'Deleted', color: '#EF4444' },
  { value: 'spam', label: 'Spam', color: '#F59E0B' },
];

export const MESSAGE_PRIORITIES: { value: MessagePriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#64748B' },
  { value: 'medium', label: 'Medium', color: '#3B82F6' },
  { value: 'high', label: 'High', color: '#F59E0B' },
  { value: 'urgent', label: 'Urgent', color: '#EF4444' },
];

export const MESSAGE_FOLDERS: { value: MessageFolder; label: string; description: string }[] = [
  { value: 'inbox', label: 'Inbox', description: 'All messages from the Contact form' },
  { value: 'unread', label: 'Unread', description: 'New messages needing attention' },
  { value: 'starred', label: 'Starred', description: 'Important messages' },
  { value: 'archived', label: 'Archived', description: 'Processed messages' },
  { value: 'trash', label: 'Trash', description: 'Deleted messages' },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 555-0123',
    subject: 'Project Collaboration Opportunity',
    message: `Hi there,

I'm the product manager at TechCorp and I came across your impressive portfolio. We're currently looking for experienced developers to collaborate on a new enterprise project.

Would you be interested in discussing this further? We have a tight deadline but are willing to offer competitive rates.

Looking forward to hearing from you.

Best regards,
Sarah Johnson`,
    priority: 'high',
    status: 'new',
    isStarred: true,
    isRead: false,
    folder: 'inbox',
    attachments: [],
    replies: [],
    createdAt: '2024-06-26T09:30:00Z',
    updatedAt: '2024-06-26T09:30:00Z',
  },
  {
    id: '2',
    fullName: 'Michael Chen',
    email: 'michael.chen@startup.io',
    phone: '+1 555-0456',
    subject: 'Freelance Project Inquiry',
    message: `Hello,

I'm the CEO of a new startup in the fintech space. We're building a revolutionary payment platform and need a senior Angular developer.

The project involves:
- Building a responsive dashboard
- Integrating with multiple payment gateways
- Real-time data visualization
- Mobile app development

Can we schedule a call this week to discuss the details?

Best,
Michael Chen`,
    priority: 'urgent',
    status: 'read',
    isStarred: false,
    isRead: true,
    folder: 'inbox',
    attachments: [],
    replies: [
      {
        id: 'r1',
        content: 'Thank you for reaching out, Michael! I\'d be happy to discuss this opportunity. Would Friday at 2 PM work for you?',
        sentAt: '2024-06-25T14:00:00Z',
        isAdmin: true,
      },
    ],
    createdAt: '2024-06-25T10:00:00Z',
    updatedAt: '2024-06-25T14:00:00Z',
  },
  {
    id: '3',
    fullName: 'Emma Williams',
    email: 'emma.w@designstudio.com',
    subject: 'Design Agency Partnership',
    message: `Hi!

I'm reaching out from a design agency. We often get requests for development services from our clients but don't have an in-house team.

Would you be interested in being our go-to developer for client projects? We handle the design and UX, you handle the implementation.

Let me know if you'd like to hear more about this arrangement.

Thanks,
Emma`,
    priority: 'medium',
    status: 'new',
    isStarred: false,
    isRead: false,
    folder: 'inbox',
    attachments: [],
    replies: [],
    createdAt: '2024-06-24T16:45:00Z',
    updatedAt: '2024-06-24T16:45:00Z',
  },
  {
    id: '4',
    fullName: 'David Park',
    email: 'david.park@enterprise.com',
    phone: '+1 555-0789',
    subject: 'Contract Position - 6 months',
    message: `Hello,

We have an immediate opening for a contract developer position at our enterprise company. The role involves maintaining and enhancing our customer-facing web applications.

Position: Senior Angular Developer
Duration: 6 months (potential extension)
Location: Remote
Rate: $120-150/hr

Please share your availability and relevant experience.

Regards,
David Park
HR Department`,
    priority: 'high',
    status: 'read',
    isStarred: true,
    isRead: true,
    folder: 'inbox',
    attachments: [
      { id: 'a1', name: 'Job_Description.pdf', size: 245000, type: 'application/pdf' },
    ],
    replies: [],
    createdAt: '2024-06-23T11:20:00Z',
    updatedAt: '2024-06-23T11:20:00Z',
  },
  {
    id: '5',
    fullName: 'Lisa Thompson',
    email: 'lisa.t@agency.net',
    subject: 'Quick Question About Your Services',
    message: `Hi there!

Just a quick question - do you offer website maintenance services after the project is completed? We're looking for ongoing support.

Thanks,
Lisa`,
    priority: 'low',
    status: 'archived',
    isStarred: false,
    isRead: true,
    folder: 'archived',
    attachments: [],
    replies: [],
    createdAt: '2024-06-22T09:00:00Z',
    updatedAt: '2024-06-22T15:30:00Z',
  },
  {
    id: '6',
    fullName: 'Robert Garcia',
    email: 'robert.g@suspicious.xyz',
    subject: 'URGENT: Million Dollar Opportunity!!!',
    message: `DEAR FRIEND,

I AM PRINCE ABACUS FROM NIGERIA. I HAVE $10,000,000 USD THAT I NEED TO TRANSFER OUT OF THE COUNTRY...

PLEASE RESPOND IMMEDIATELY FOR MORE DETAILS.

GOD BLESS!`,
    priority: 'low',
    status: 'spam',
    isStarred: false,
    isRead: true,
    folder: 'spam',
    attachments: [],
    replies: [],
    createdAt: '2024-06-21T03:00:00Z',
    updatedAt: '2024-06-21T03:00:00Z',
  },
  {
    id: '7',
    fullName: 'Amanda Foster',
    email: 'amanda.f@ecommerce.com',
    subject: 'E-commerce Platform Development',
    message: `Hello,

We're looking to build a custom e-commerce platform similar to Shopify but with our unique features.

Key requirements:
- Multi-vendor marketplace
- Inventory management
- Payment processing
- Mobile responsive
- Analytics dashboard

What's your estimated timeline and cost for this type of project?

Best,
Amanda Foster`,
    priority: 'medium',
    status: 'read',
    isStarred: false,
    isRead: true,
    folder: 'inbox',
    attachments: [],
    replies: [],
    createdAt: '2024-06-20T14:30:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: '8',
    fullName: 'James Wilson',
    email: 'james.wilson@techcorp.com',
    subject: 'Technical Interview Invitation',
    message: `Hi,

Thank you for applying to the Senior Developer position at TechCorp. We were impressed with your background and would like to invite you for a technical interview.

Date: Next Tuesday
Time: 10:00 AM - 12:00 PM
Format: Video call (link will be sent separately)

Please confirm your availability.

Best regards,
James Wilson
TechCorp Recruiting`,
    priority: 'high',
    status: 'deleted',
    isStarred: false,
    isRead: true,
    folder: 'trash',
    attachments: [],
    replies: [],
    createdAt: '2024-06-19T10:00:00Z',
    updatedAt: '2024-06-20T16:00:00Z',
  },
];
