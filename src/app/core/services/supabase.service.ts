import { Injectable } from '@angular/core';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

export type AthleteLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface RunnerProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  age?: number | null;
  level: AthleteLevel;
  active_plan_id: string;
  avatar_url?: string | null;
  goal_distance?: string | null;
  target_pace?: string | null;
  weekly_frequency?: number | null;
  weight_kg?: number | null;
  height_cm?: number | null;
  updated_at?: string;
}

export interface CompletedWorkoutRecord {
  id?: string;
  user_id?: string;
  plan_id: string;
  workout_id: string;
  distance_km?: number;
  duration_minutes?: number;
  avg_pace?: string;
  perceived_effort?: number;
  completed_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private profileSubject = new BehaviorSubject<RunnerProfile | null>(null);
  public readonly profile$ = this.profileSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  public get currentProfileValue(): RunnerProfile | null {
    return this.profileSubject.value;
  }

  public clearProfileState(): void {
    this.profileSubject.next(null);
  }

  // --- AUTENTICAÇÃO ---
  async signUp(
    email: string,
    password: string,
    fullName: string,
    level: AthleteLevel = 'Iniciante'
  ): Promise<User | null> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw new Error(error.message);

    if (data.user) {
      await this.upsertProfile({
        id: data.user.id,
        full_name: fullName,
        email,
        level,
        active_plan_id: level === 'Avançado' ? '21k' : level === 'Intermediário' ? '10k' : '5k',
      });
    }

    return data.user;
  }

  async signIn(email: string, password: string): Promise<User | null> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return data.user;
  }

  async signOut(): Promise<void> {
    this.clearProfileState();
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  async resetPassword(email: string): Promise<void> {
    const redirectTo = `${window.location.origin}/`;
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw new Error(error.message);
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(error.message);
  }

  onAuthStateChange(callback: (event: string) => void): void {
    this.supabase.auth.onAuthStateChange((event) => {
      callback(event);
    });
  }

  // --- PERFIL DO ATLETA & AVATAR ---
  async getProfile(): Promise<RunnerProfile | null> {
    const user = await this.getCurrentUser();
    if (!user) {
      this.clearProfileState();
      return null;
    }

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;

    const profile = data as RunnerProfile;
    this.profileSubject.next(profile);
    localStorage.setItem('correja_user_name', profile.full_name);

    if (profile.avatar_url) {
      localStorage.setItem('correja_user_photo', profile.avatar_url);
    }

    return profile;
  }

  async upsertProfile(profile: Partial<RunnerProfile> & { id: string }): Promise<RunnerProfile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .upsert({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (profile.full_name) {
      await this.supabase.auth.updateUser({
        data: { full_name: profile.full_name },
      });
    }

    const updated = data as RunnerProfile;
    this.profileSubject.next(updated);
    localStorage.setItem('correja_user_name', updated.full_name);
    return updated;
  }

  async uploadAvatar(file: File): Promise<string> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Sessão expirada. Faça login novamente.');

    const optimizedBlob = await this.compressAvatarImage(file, 400, 0.82);
    const filePath = `${user.id}/avatar-${Date.now()}.jpg`;

    const uploadPromise = this.supabase.storage
      .from('avatars')
      .upload(filePath, optimizedBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('Tempo limite excedido ao enviar a foto.')),
        15000
      )
    );

    const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]);
    if (uploadError) {
      throw new Error(uploadError.message || 'Erro de permissão no bucket avatars.');
    }

    const { data } = this.supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    const existingProfile = await this.getProfile();
    const fallbackName =
      existingProfile?.full_name ||
      (user.user_metadata?.['full_name'] as string | undefined) ||
      localStorage.getItem('correja_user_name') ||
      'Atleta CorreJa';

    await this.upsertProfile({
      id: user.id,
      full_name: fallbackName,
      email: existingProfile?.email || user.email || '',
      level: existingProfile?.level || 'Iniciante',
      active_plan_id: existingProfile?.active_plan_id || '5k',
      avatar_url: publicUrl,
    });

    return publicUrl;
  }

  private compressAvatarImage(file: File, maxSize = 400, quality = 0.82): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => resolve(blob || file),
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    });
  }

  // --- TREINOS CONCLUÍDOS ---
  async getCompletedWorkouts(planId?: string): Promise<CompletedWorkoutRecord[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    let query = this.supabase
      .from('completed_workouts')
      .select('*')
      .eq('user_id', user.id);

    if (planId) {
      query = query.eq('plan_id', planId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data as CompletedWorkoutRecord[]) || [];
  }

  async markWorkoutCompleted(record: CompletedWorkoutRecord): Promise<CompletedWorkoutRecord> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await this.supabase
      .from('completed_workouts')
      .upsert(
        {
          user_id: user.id,
          ...record,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,plan_id,workout_id' }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as CompletedWorkoutRecord;
  }

  async unmarkWorkoutCompleted(planId: string, workoutId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) return;

    const { error } = await this.supabase
      .from('completed_workouts')
      .delete()
      .eq('user_id', user.id)
      .eq('plan_id', planId)
      .eq('workout_id', workoutId);

    if (error) throw new Error(error.message);
  }
}