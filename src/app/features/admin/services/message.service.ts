// ============================================================
// MESSAGE SERVICE
// Admin inbox + contact form messages API
// ============================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { Message, MessageFolder } from '../models/message.model';

interface MessageApiResponse {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  isStarred: boolean;
  isRead: boolean;
  folder: string;
  attachments?: unknown[];
  replies?: unknown[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getMessages(folder?: MessageFolder): Observable<Message[]> {
    const params: Record<string, string> = {};
    if (folder && folder !== 'unread' && folder !== 'starred') {
      params['folder'] = folder;
    }
    return this.http
      .get<ApiResponse<MessageApiResponse[]>>(`${this.baseUrl}${API_ENDPOINTS.MESSAGES}`, { params })
      .pipe(
        map(response => (response.success && response.data ? response.data.map(item => this.toMessage(item)) : [])),
        catchError(error => throwError(() => this.toError(error)))
      );
  }

  getMessageById(id: string): Observable<Message | null> {
    return this.http.get<ApiResponse<MessageApiResponse>>(`${this.baseUrl}${API_ENDPOINTS.MESSAGE_BY_ID(id)}`).pipe(
      map(response => (response.success && response.data ? this.toMessage(response.data) : null)),
      catchError(error => throwError(() => this.toError(error)))
    );
  }

  patchRead(id: string, isRead: boolean): Observable<Message> {
    return this.http
      .patch<ApiResponse<MessageApiResponse>>(`${this.baseUrl}${API_ENDPOINTS.MESSAGE_READ(id)}`, { isRead })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw { message: response.message || 'Update failed' };
          }
          return this.toMessage(response.data);
        }),
        catchError(error => throwError(() => this.toError(error)))
      );
  }

  patchStar(id: string, isStarred: boolean): Observable<Message> {
    return this.http
      .patch<ApiResponse<MessageApiResponse>>(`${this.baseUrl}${API_ENDPOINTS.MESSAGE_STAR(id)}`, { isStarred })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw { message: response.message || 'Update failed' };
          }
          return this.toMessage(response.data);
        }),
        catchError(error => throwError(() => this.toError(error)))
      );
  }

  archiveMessage(id: string): Observable<Message> {
    return this.http
      .patch<ApiResponse<MessageApiResponse>>(`${this.baseUrl}${API_ENDPOINTS.MESSAGE_ARCHIVE(id)}`, {})
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw { message: response.message || 'Archive failed' };
          }
          return this.toMessage(response.data);
        }),
        catchError(error => throwError(() => this.toError(error)))
      );
  }

  restoreMessage(id: string): Observable<Message> {
    return this.http
      .patch<ApiResponse<MessageApiResponse>>(`${this.baseUrl}${API_ENDPOINTS.MESSAGE_RESTORE(id)}`, {})
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw { message: response.message || 'Restore failed' };
          }
          return this.toMessage(response.data);
        }),
        catchError(error => throwError(() => this.toError(error)))
      );
  }

  deleteMessage(id: string): Observable<Message> {
    return this.http
      .delete<ApiResponse<MessageApiResponse>>(`${this.baseUrl}${API_ENDPOINTS.MESSAGE_BY_ID(id)}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw { message: response.message || 'Delete failed' };
          }
          return this.toMessage(response.data);
        }),
        catchError(error => throwError(() => this.toError(error)))
      );
  }

  private toMessage(item: MessageApiResponse): Message {
    return {
      id: item.id,
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      subject: item.subject,
      message: item.message,
      priority: item.priority as Message['priority'],
      status: item.status as Message['status'],
      isStarred: item.isStarred,
      isRead: item.isRead,
      folder: item.folder as MessageFolder,
      attachments: [],
      replies: [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  private toError(error: HttpErrorResponse): { message: string; code?: string } {
    const body = error.error as { message?: string; error?: string } | null;
    return {
      message: body?.message || error.message || 'Request failed',
      code: body?.error || `HTTP_${error.status}`,
    };
  }
}
