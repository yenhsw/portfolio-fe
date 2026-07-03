// ============================================================
// MESSAGE STORE
// Signal-based state management for contact messages
// ============================================================

import { Injectable, computed, signal } from '@angular/core';
import { Message, MessageStatus } from '../shared/models';

export interface MessageState {
  messages: Message[];
  selectedMessage: Message | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MessageStore {
  // ============================================================
  // SIGNALS
  // ============================================================

  private readonly _messages = signal<Message[]>([]);
  private readonly _selectedMessage = signal<Message | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _pagination = signal({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // ============================================================
  // COMPUTED
  // ============================================================

  readonly messages = this._messages.asReadonly();
  readonly selectedMessage = this._selectedMessage.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly pagination = this._pagination.asReadonly();

  readonly messageCount = computed(() => this._messages().length);
  readonly hasMessages = computed(() => this._messages().length > 0);
  readonly hasSelectedMessage = computed(() => this._selectedMessage() !== null);

  readonly unreadCount = computed(() => {
    return this._messages().filter((m) => !m.read).length;
  });

  readonly unreadMessages = computed(() => {
    return this._messages().filter((m) => !m.read);
  });

  readonly readMessages = computed(() => {
    return this._messages().filter((m) => m.read);
  });

  readonly repliedMessages = computed(() => {
    return this._messages().filter((m) => m.replied);
  });

  readonly messagesByStatus = computed(() => {
    const messages = this._messages();
    const grouped = new Map<MessageStatus, Message[]>();

    messages.forEach((message) => {
      const existing = grouped.get(message.status) ?? [];
      grouped.set(message.status, [...existing, message]);
    });

    return grouped;
  });

  readonly recentMessages = computed(() => {
    return [...this._messages()]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 10);
  });

  // ============================================================
  // ACTIONS
  // ============================================================

  setMessages(messages: Message[]): void {
    this._messages.set(messages);
  }

  addMessage(message: Message): void {
    this._messages.update((current) => [message, ...current]);
    this._pagination.update((current) => ({
      ...current,
      total: current.total + 1,
    }));
  }

  setSelectedMessage(message: Message | null): void {
    this._selectedMessage.set(message);
  }

  markAsRead(id: string): void {
    this._messages.update((messages) =>
      messages.map((m) => (m.id === id ? { ...m, read: true } : m))
    );

    if (this._selectedMessage()?.id === id) {
      this._selectedMessage.update((m) => (m ? { ...m, read: true } : m));
    }
  }

  markAllAsRead(): void {
    this._messages.update((messages) =>
      messages.map((m) => ({ ...m, read: true }))
    );
  }

  updateStatus(id: string, status: MessageStatus): void {
    this._messages.update((messages) =>
      messages.map((m) => (m.id === id ? { ...m, status } : m))
    );

    if (this._selectedMessage()?.id === id) {
      this._selectedMessage.update((m) =>
        m ? { ...m, status } : m
      );
    }
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  setPagination(pagination: Partial<MessageState['pagination']>): void {
    this._pagination.update((current) => ({ ...current, ...pagination }));
  }

  deleteMessage(id: string): void {
    this._messages.update((messages) => messages.filter((m) => m.id !== id));

    if (this._selectedMessage()?.id === id) {
      this._selectedMessage.set(null);
    }

    this._pagination.update((current) => ({
      ...current,
      total: Math.max(0, current.total - 1),
    }));
  }

  clearMessages(): void {
    this._messages.set([]);
    this._selectedMessage.set(null);
    this._pagination.set({ page: 1, limit: 20, total: 0, totalPages: 0 });
  }

  reset(): void {
    this._messages.set([]);
    this._selectedMessage.set(null);
    this._loading.set(false);
    this._error.set(null);
    this._pagination.set({ page: 1, limit: 20, total: 0, totalPages: 0 });
  }

  // ============================================================
  // SELECTORS
  // ============================================================

  selectMessageById(id: string): Message | undefined {
    return this._messages().find((m) => m.id === id);
  }

  selectMessagesByStatus(status: MessageStatus): Message[] {
    return this._messages().filter((m) => m.status === status);
  }
}
