// ============================================================
// MESSAGE SERVICE
// Messages API Service (Mock Implementation)
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Message } from '../models/message.model';
import { MOCK_MESSAGES } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private mockMessages: Message[] = [...MOCK_MESSAGES];

  getMessages(): Observable<Message[]> {
    return of(this.mockMessages).pipe(delay(300));
  }

  getMessageById(id: string): Observable<Message | null> {
    const msg = this.mockMessages.find(m => m.id === id);
    return of(msg || null).pipe(delay(200));
  }

  markAsRead(id: string): Observable<boolean> {
    return of(true).pipe(delay(200));
  }

  markAsUnread(id: string): Observable<boolean> {
    return of(true).pipe(delay(200));
  }

  toggleStar(id: string): Observable<boolean> {
    return of(true).pipe(delay(200));
  }

  archiveMessage(id: string): Observable<boolean> {
    return of(true).pipe(delay(200));
  }

  deleteMessage(id: string): Observable<boolean> {
    return of(true).pipe(delay(200));
  }

  sendReply(messageId: string, content: string): Observable<boolean> {
    return of(true).pipe(delay(500));
  }
}
