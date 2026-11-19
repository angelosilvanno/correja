import { Injectable } from '@angular/core';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

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

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
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
    });

    if (error) throw error;

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

    if (error) throw error;
    return data.user;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  // --- PERFIL DO ATLETA & AVATAR ---
  async getProfile(): Promise<RunnerProfile | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;
    return data as RunnerProfile;
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

    if (error) throw error;
    return data as RunnerProfile;
  }

  async uploadAvatar(file: File): Promise<string> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await this.supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = this.supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    await this.upsertProfile({
      id: user.id,
      avatar_url: data.publicUrl,
    });

    return data.publicUrl;
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
    if (error) throw error;
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

    if (error) throw error;
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

    if (error) throw error;
  }
}