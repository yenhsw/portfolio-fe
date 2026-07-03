// ============================================================
// MESSAGE STORE
// Messages Management State with Signals
// ============================================================

import { Injectable, signal, computed } from '@angular/core';
import { Message, MessageFolder, MessageFormData, MOCK_MESSAGES } from '../models/message.model';

export interface MessageState {
  messages: Message[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  selectedMessage: Message | null;
  activeFolder: MessageFolder;
  searchQuery: string;
  filterPriority: string;
  filterStatus: string;
  selectedIds: Set<string>;
}

@Injectable({
  providedIn: 'root',
})
export class MessageStore {
  // State
  readonly messages = signal<Message[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedMessage = signal<Message | null>(null);
  readonly activeFolder = signal<MessageFolder>('inbox');
  readonly searchQuery = signal('');
  readonly filterPriority = signal('');
  readonly filterStatus = signal('');
  readonly selectedIds = signal<Set<string>>(new Set());

  // Computed
  readonly filteredMessages = computed(() => {
    let result = [...this.messages()];
    const folder = this.activeFolder();
    const query = this.searchQuery().toLowerCase();
    const priority = this.filterPriority();
    const status = this.filterStatus();

    // Filter by folder
    result = this.filterByFolder(result, folder);

    // Search filter
    if (query) {
      result = result.filter(msg =>
        msg.fullName.toLowerCase().includes(query) ||
        msg.email.toLowerCase().includes(query) ||
        msg.subject.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query)
      );
    }

    // Priority filter
    if (priority) {
      result = result.filter(msg => msg.priority === priority);
    }

    // Status filter
    if (status) {
      result = result.filter(msg => msg.status === status);
    }

    // Sort by createdAt (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  });

  readonly unreadCount = computed(() => {
    return this.messages().filter(m => !m.isRead && m.folder === 'inbox').length;
  });

  readonly totalUnread = computed(() => {
    return this.messages().filter(m => !m.isRead && m.folder !== 'trash' && m.folder !== 'spam').length;
  });

  readonly folderCounts = computed(() => {
    const msgs = this.messages();
    return {
      inbox: msgs.filter(m => m.folder === 'inbox').length,
      unread: msgs.filter(m => !m.isRead && m.folder === 'inbox').length,
      starred: msgs.filter(m => m.isStarred).length,
      archived: msgs.filter(m => m.folder === 'archived').length,
      trash: msgs.filter(m => m.folder === 'trash').length,
      spam: msgs.filter(m => m.folder === 'spam').length,
    };
  });

  readonly hasSelectedItems = computed(() => this.selectedIds().size > 0);
  readonly selectedCount = computed(() => this.selectedIds().size);

  private filterByFolder(messages: Message[], folder: MessageFolder): Message[] {
    switch (folder) {
      case 'inbox':
        return messages.filter(m => m.folder === 'inbox' || (!m.isRead && m.status !== 'deleted'));
      case 'unread':
        return messages.filter(m => !m.isRead && m.folder === 'inbox');
      case 'starred':
        return messages.filter(m => m.isStarred);
      case 'archived':
        return messages.filter(m => m.folder === 'archived');
      case 'trash':
        return messages.filter(m => m.folder === 'trash');
      case 'spam':
        return messages.filter(m => m.folder === 'spam');
      default:
        return messages;
    }
  }

  // Actions
  loadMessages(): void {
    this.loading.set(true);
    this.error.set(null);

    setTimeout(() => {
      this.messages.set([...MOCK_MESSAGES]);
      this.loading.set(false);
    }, 500);
  }

  getMessageById(id: string): Message | undefined {
    return this.messages().find(m => m.id === id);
  }

  markAsRead(id: string): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        m.id === id ? { ...m, isRead: true, status: 'read' as const, updatedAt: new Date().toISOString() } : m
      )
    );
  }

  markAsUnread(id: string): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        m.id === id ? { ...m, isRead: false, updatedAt: new Date().toISOString() } : m
      )
    );
  }

  toggleStar(id: string): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        m.id === id ? { ...m, isStarred: !m.isStarred } : m
      )
    );
  }

  archiveMessage(id: string): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        m.id === id ? { ...m, folder: 'archived' as const, updatedAt: new Date().toISOString() } : m
      )
    );
    if (this.selectedMessage()?.id === id) {
      this.selectedMessage.update(m => m ? { ...m, folder: 'archived' } : null);
    }
  }

  unarchiveMessage(id: string): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        m.id === id ? { ...m, folder: 'inbox' as const, updatedAt: new Date().toISOString() } : m
      )
    );
  }

  deleteMessage(id: string): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        m.id === id ? { ...m, folder: 'trash' as const, updatedAt: new Date().toISOString() } : m
      )
    );
    if (this.selectedMessage()?.id === id) {
      this.closeConversation();
    }
  }

  permanentlyDeleteMessage(id: string): void {
    this.messages.update(msgs => msgs.filter(m => m.id !== id));
    if (this.selectedMessage()?.id === id) {
      this.closeConversation();
    }
  }

  moveToSpam(id: string): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        m.id === id ? { ...m, folder: 'spam' as const, status: 'spam' as const, updatedAt: new Date().toISOString() } : m
      )
    );
  }

  notSpam(id: string): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        m.id === id ? { ...m, folder: 'inbox' as const, status: 'read' as const, updatedAt: new Date().toISOString() } : m
      )
    );
  }

  restoreMessage(id: string): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        m.id === id ? { ...m, folder: 'inbox' as const, status: 'read' as const, updatedAt: new Date().toISOString() } : m
      )
    );
  }

  sendReply(messageId: string, content: string): void {
    const reply = {
      id: `reply_${Date.now()}`,
      content,
      sentAt: new Date().toISOString(),
      isAdmin: true,
    };

    this.messages.update(msgs =>
      msgs.map(m =>
        m.id === messageId
          ? { ...m, replies: [...m.replies, reply], updatedAt: new Date().toISOString() }
          : m
      )
    );
  }

  // Bulk actions
  bulkMarkRead(ids: string[]): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        ids.includes(m.id) ? { ...m, isRead: true, status: 'read' as const } : m
      )
    );
    this.selectedIds.set(new Set());
  }

  bulkMarkUnread(ids: string[]): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        ids.includes(m.id) ? { ...m, isRead: false } : m
      )
    );
    this.selectedIds.set(new Set());
  }

  bulkArchive(ids: string[]): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        ids.includes(m.id) ? { ...m, folder: 'archived' as const } : m
      )
    );
    this.selectedIds.set(new Set());
  }

  bulkDelete(ids: string[]): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        ids.includes(m.id) ? { ...m, folder: 'trash' as const } : m
      )
    );
    this.selectedIds.set(new Set());
  }

  bulkMoveToSpam(ids: string[]): void {
    this.messages.update(msgs =>
      msgs.map(m =>
        ids.includes(m.id) ? { ...m, folder: 'spam' as const, status: 'spam' as const } : m
      )
    );
    this.selectedIds.set(new Set());
  }

  // Filters
  setActiveFolder(folder: MessageFolder): void {
    this.activeFolder.set(folder);
    this.selectedIds.set(new Set());
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setFilterPriority(priority: string): void {
    this.filterPriority.set(priority);
  }

  setFilterStatus(status: string): void {
    this.filterStatus.set(status);
  }

  // Selection
  toggleSelection(id: string): void {
    this.selectedIds.update(ids => {
      const newSet = new Set(ids);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  selectAll(): void {
    const allIds = this.filteredMessages().map(m => m.id);
    this.selectedIds.set(new Set(allIds));
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  toggleSelectAll(): void {
    if (this.hasSelectedItems()) {
      this.clearSelection();
    } else {
      this.selectAll();
    }
  }

  // Conversation
  selectMessage(id: string): void {
    const msg = this.getMessageById(id);
    if (msg) {
      this.selectedMessage.set(msg);
      if (!msg.isRead) {
        this.markAsRead(id);
      }
    }
  }

  closeConversation(): void {
    this.selectedMessage.set(null);
  }

  // Utilities
  getPriorityLabel(priority: string): string {
    const configs: Record<string, string> = {
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'urgent': 'Urgent',
    };
    return configs[priority] || priority;
  }

  getPriorityColor(priority: string): string {
    const configs: Record<string, string> = {
      'low': '#64748B',
      'medium': '#3B82F6',
      'high': '#F59E0B',
      'urgent': '#EF4444',
    };
    return configs[priority] || '#64748B';
  }

  getStatusLabel(status: string): string {
    const configs: Record<string, string> = {
      'new': 'New',
      'read': 'Read',
      'archived': 'Archived',
      'deleted': 'Deleted',
      'spam': 'Spam',
    };
    return configs[status] || status;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  clearError(): void {
    this.error.set(null);
  }

  reset(): void {
    this.searchQuery.set('');
    this.filterPriority.set('');
    this.filterStatus.set('');
    this.selectedIds.set(new Set());
    this.error.set(null);
  }
}
