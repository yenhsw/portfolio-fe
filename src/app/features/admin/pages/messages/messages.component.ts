// ============================================================
// MESSAGES COMPONENT
// Contact form message inbox from Home
// ============================================================

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageStore } from '../../store/message.store';
import { Message, MessageFolder } from '../../models/message.model';
import {
  AdminPageComponent,
  AdminButtonComponent,
  AdminConfirmDialogComponent,
} from '../../../../shared/components';
import { NotificationService } from '../../../../core/services/notification.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { ConfirmConfig } from '../../../../shared/models/crud.models';

const MESSAGE_FOLDER_KEYS: MessageFolder[] = ['inbox', 'unread', 'starred', 'archived', 'trash'];

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminPageComponent,
    AdminButtonComponent,
    AdminConfirmDialogComponent,
    TranslatePipe,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit {
  readonly store = inject(MessageStore);
  private readonly notify = inject(NotificationService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly locale = inject(LocaleService);

  readonly isReady = signal(false);
  readonly confirmOpen = signal(false);
  readonly confirmConfig = signal<ConfirmConfig | null>(null);
  private pendingDeleteId: string | null = null;

  readonly pageIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';

  readonly folderList = computed(() => {
    this.locale.locale();
    return MESSAGE_FOLDER_KEYS.map(value => ({
      value,
      label: this.locale.t(`admin.pages.messages.folders.${value}.label`),
      description: this.locale.t(`admin.pages.messages.folders.${value}.description`),
    }));
  });

  readonly statList = computed(() => {
    this.locale.locale();
    const counts = this.store.folderCounts();
    return [
      { label: this.locale.t('admin.pages.messages.stats.inbox'), value: counts.inbox, accent: '#8b5cf6' },
      { label: this.locale.t('admin.pages.messages.stats.unread'), value: counts.unread, accent: '#10b981' },
      { label: this.locale.t('admin.pages.messages.stats.starred'), value: counts.starred, accent: '#f59e0b' },
      { label: this.locale.t('admin.pages.messages.stats.archived'), value: counts.archived, accent: '#64748b' },
    ];
  });

  readonly activeFolderMeta = computed(() =>
    this.folderList().find(f => f.value === this.store.activeFolder()),
  );

  ngOnInit(): void {
    this.store.loadMessages();
    setTimeout(() => this.isReady.set(true), 100);
  }

  setFolder(folder: MessageFolder): void {
    this.store.setActiveFolder(folder);
    this.store.closeConversation();
  }

  selectMessage(msg: Message): void {
    this.store.selectMessage(msg.id);
  }

  onSearch(value: string): void {
    this.store.setSearchQuery(value);
  }

  toggleStar(id: string, event: Event): void {
    event.stopPropagation();
    this.store.toggleStar(id);
    this.notify.info('Star status updated.');
  }

  markUnread(id: string): void {
    this.store.markAsUnread(id);
    this.notify.info('Marked as unread.');
  }

  archiveMessage(id: string): void {
    this.store.archiveMessage(id);
    this.notify.success('Moved to Archive.');
  }

  restoreMessage(id: string): void {
    this.store.unarchiveMessage(id);
    this.notify.success('Restored to Inbox.');
  }

  confirmDelete(id: string): void {
    this.pendingDeleteId = id;
    this.confirmConfig.set({
      title: 'Delete message',
      message: 'Move this message to Trash?',
      detail: 'You can restore it from Trash later.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmType: 'danger',
    });
    this.confirmOpen.set(true);
  }

  onConfirmDelete(): void {
    if (this.pendingDeleteId) {
      this.store.deleteMessage(this.pendingDeleteId);
      this.notify.success('Moved to Trash.');
    }
    this.closeConfirm();
  }

  closeConfirm(): void {
    this.confirmOpen.set(false);
    this.confirmConfig.set(null);
    this.pendingDeleteId = null;
  }

  replyByEmail(msg: Message): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const subject = encodeURIComponent(`Re: ${msg.subject}`);
    const body = encodeURIComponent(
      `\n\n---\nOriginal message from ${msg.fullName} (${msg.email}):\n${msg.message}`,
    );
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
  }

  copyEmail(email: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    navigator.clipboard?.writeText(email);
    this.notify.success('Email copied.');
  }

  folderCount(folder: MessageFolder): number {
    const counts = this.store.folderCounts();
    if (folder === 'unread') return counts.unread;
    if (folder === 'starred') return counts.starred;
    if (folder === 'archived') return counts.archived;
    if (folder === 'trash') return counts.trash;
    return counts.inbox;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
    };
    return labels[priority] || priority;
  }

  getPriorityColor(priority: string): string {
    return this.store.getPriorityColor(priority);
  }

  formatDate(dateStr: string): string {
    return this.store.formatDate(dateStr);
  }

  formatFullDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getPreview(message: string): string {
    const text = message.replace(/\n/g, ' ').trim();
    return text.length > 90 ? `${text.slice(0, 90)}…` : text;
  }
}
