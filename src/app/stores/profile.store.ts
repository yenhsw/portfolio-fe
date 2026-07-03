// ============================================================
// PROFILE STORE
// Signal-based state management for profile data
// ============================================================

import { computed, Injectable, signal } from '@angular/core';
import { Profile, ProfileStats } from '../shared/models';

export interface ProfileState {
  profile: Profile | null;
  stats: ProfileStats | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileStore {
  // ============================================================
  // SIGNALS
  // ============================================================

  private readonly _profile = signal<Profile | null>(null);
  private readonly _stats = signal<ProfileStats | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // ============================================================
  // COMPUTED
  // ============================================================

  readonly profile = this._profile.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasProfile = computed(() => this._profile() !== null);
  readonly fullName = computed(() => this._profile()?.fullName ?? '');
  readonly avatar = computed(() => this._profile()?.avatar ?? '');
  readonly title = computed(() => this._profile()?.title ?? '');
  readonly isAvailable = computed(() => this._profile()?.available ?? false);

  // ============================================================
  // ACTIONS
  // ============================================================

  setProfile(profile: Profile): void {
    this._profile.set(profile);
  }

  setStats(stats: ProfileStats): void {
    this._stats.set(stats);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  clearError(): void {
    this._error.set(null);
  }

  reset(): void {
    this._profile.set(null);
    this._stats.set(null);
    this._loading.set(false);
    this._error.set(null);
  }

  // ============================================================
  // SELECTORS
  // ============================================================

  selectField<K extends keyof Profile>(field: K): () => Profile[K] {
    return () => this._profile()?.[field] as Profile[K];
  }

  selectStatsField<K extends keyof ProfileStats>(
    field: K
  ): () => ProfileStats[K] {
    return () => this._stats()?.[field] as ProfileStats[K];
  }
}
