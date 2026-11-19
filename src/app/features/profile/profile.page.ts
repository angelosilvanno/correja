import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonToggle } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  arrowForwardOutline,
  calendarOutline,
  cameraOutline,
  checkmarkCircleOutline,
  chevronForwardOutline,
  closeOutline,
  createOutline,
  logOutOutline,
  notificationsOutline,
  optionsOutline,
  personOutline
} from 'ionicons/icons';

import {
  type AthleteLevel,
  SupabaseService
} from '../../core/services/supabase.service';

export interface UserProfileData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  age: number | null;
  height: string;
  weight: string;
  experience: string;
  weeklyFrequency: string;
  targetDistance: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonToggle],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  private readonly nameStorageKey = 'correja_user_name';
  private readonly profileStorageKey = 'correja_user_profile';
  private readonly photoStorageKey = 'correja_user_photo';
  private readonly notificationsStorageKey = 'correja_notifications_enabled';

  athleteName = '';
  athleteLevel: AthleteLevel = 'Iniciante';
  profilePhotoUrl: string | null = null;

  // Controle do Modal de Pré-visualização da Foto
  isPhotoModalOpen = false;
  photoPreviewUrl: string | null = null;
  private selectedPhotoFile: File | null = null;

  isUploadingPhoto = false;
  isSavingProfile = false;
  isEditingProfile = false;
  notificationsEnabled = true;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';
  validationErrors: Record<string, string> = {};

  profileForm: UserProfileData = {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    age: null,
    height: '',
    weight: '',
    experience: 'Estou começando',
    weeklyFrequency: '3 vezes por semana',
    targetDistance: '5 km'
  };

  editDraft: UserProfileData = { ...this.profileForm };

  constructor() {
    addIcons({
      alertCircleOutline,
      arrowForwardOutline,
      calendarOutline,
      cameraOutline,
      checkmarkCircleOutline,
      chevronForwardOutline,
      closeOutline,
      createOutline,
      logOutOutline,
      notificationsOutline,
      optionsOutline,
      personOutline
    });
  }

  public get athleteInitials(): string {
    const clean = (this.athleteName ?? '').trim();
    if (!clean) return 'AC';

    const parts = clean.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    const first = parts[0].charAt(0);
    const last = parts[parts.length - 1].charAt(0);
    return `${first}${last}`.toUpperCase();
  }

  public async ngOnInit(): Promise<void> {
    this.loadStoredProfile();
    await this.loadCloudProfile();
  }

  public async ionViewWillEnter(): Promise<void> {
    this.loadStoredProfile();
    await this.loadCloudProfile();
  }

  public triggerPhotoPicker(input: HTMLInputElement): void {
    if (this.isUploadingPhoto) return;
    input.click();
  }

  public onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.showFeedback('Formato inválido. Selecione uma imagem JPG, PNG ou WebP.', 'error');
      input.value = '';
      return;
    }

    const maxBytes = 3 * 1024 * 1024;
    if (file.size > maxBytes) {
      this.showFeedback('A imagem deve ter no máximo 3 MB.', 'error');
      input.value = '';
      return;
    }

    if (this.photoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }

    this.selectedPhotoFile = file;
    this.photoPreviewUrl = URL.createObjectURL(file);
    this.isPhotoModalOpen = true;
    this.cdr.detectChanges();
  }

  public closePhotoModal(input: HTMLInputElement): void {
    if (this.isUploadingPhoto) return;
    if (this.photoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
    this.isPhotoModalOpen = false;
    this.photoPreviewUrl = null;
    this.selectedPhotoFile = null;
    input.value = '';
    this.cdr.detectChanges();
  }

  public async confirmPhotoUpload(input: HTMLInputElement): Promise<void> {
    if (!this.selectedPhotoFile || this.isUploadingPhoto) return;

    this.isUploadingPhoto = true;
    this.cdr.detectChanges();

    try {
      const publicUrl = await this.supabaseService.uploadAvatar(this.selectedPhotoFile);
      this.profilePhotoUrl = publicUrl;
      localStorage.setItem(this.photoStorageKey, publicUrl);

      if (this.photoPreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(this.photoPreviewUrl);
      }

      this.isPhotoModalOpen = false;
      this.photoPreviewUrl = null;
      this.selectedPhotoFile = null;
      input.value = '';

      this.showFeedback('Foto de perfil atualizada com sucesso!', 'success');
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : 'Erro desconhecido';
      this.showFeedback(`Falha ao salvar foto: ${detail}`, 'error');
    } finally {
      this.isUploadingPhoto = false;
      this.cdr.detectChanges();
    }
  }

  public editName(): void {
    this.openEditForm();
  }

  public openEditForm(): void {
    this.validationErrors = {};
    this.editDraft = { ...this.profileForm };
    this.isEditingProfile = true;
  }

  public cancelEditForm(): void {
    this.validationErrors = {};
    this.editDraft = { ...this.profileForm };
    this.isEditingProfile = false;
  }

  public async saveProfileChanges(): Promise<void> {
    if (!this.validateDraft()) {
      this.showFeedback('Verifique os campos obrigatórios antes de salvar.', 'error');
      return;
    }

    if (this.isSavingProfile) return;
    this.isSavingProfile = true;

    const cleanedFullName = this.editDraft.fullName.trim();
    const cleanedEmail = this.editDraft.email.trim();
    const cleanedPhone = this.editDraft.phone.trim();
    const cleanedCity = this.editDraft.city.trim();
    const cleanedHeight = this.editDraft.height.trim();
    const cleanedWeight = this.editDraft.weight.trim();
    const mappedLevel = this.mapExperienceToLevel(this.editDraft.experience);

    this.profileForm = {
      ...this.editDraft,
      fullName: cleanedFullName,
      email: cleanedEmail,
      phone: cleanedPhone,
      city: cleanedCity,
      height: cleanedHeight,
      weight: cleanedWeight
    };

    this.athleteName = cleanedFullName;
    this.athleteLevel = mappedLevel;

    try {
      const user = await this.supabaseService.getCurrentUser();
      if (!user) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      const parsedWeight = parseFloat(cleanedWeight.replace(',', '.'));
      const rawHeight = parseFloat(cleanedHeight.replace(',', '.'));
      const parsedHeightCm = Number.isNaN(rawHeight)
        ? null
        : rawHeight < 3
          ? Math.round(rawHeight * 100)
          : Math.round(rawHeight);
      const parsedFreq = parseInt(this.profileForm.weeklyFrequency.replace(/\D/g, ''), 10);

      await this.supabaseService.upsertProfile({
        id: user.id,
        full_name: cleanedFullName,
        email: cleanedEmail,
        phone: cleanedPhone || null,
        city: cleanedCity || null,
        age: this.profileForm.age ?? null,
        level: mappedLevel,
        goal_distance: this.profileForm.targetDistance,
        weekly_frequency: Number.isNaN(parsedFreq) ? 3 : parsedFreq,
        weight_kg: Number.isNaN(parsedWeight) ? null : parsedWeight,
        height_cm: parsedHeightCm
      });

      localStorage.setItem(this.nameStorageKey, cleanedFullName);
      localStorage.setItem(this.profileStorageKey, JSON.stringify(this.profileForm));
      this.isEditingProfile = false;
      this.showFeedback('Informações pessoais salvas no banco de dados!', 'success');
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : 'Erro desconhecido';
      this.showFeedback(`Erro ao salvar no banco: ${detail}`, 'error');
    } finally {
      this.isSavingProfile = false;
      this.cdr.detectChanges();
    }
  }

  public onToggleNotifications(): void {
    try {
      localStorage.setItem(this.notificationsStorageKey, String(this.notificationsEnabled));
    } catch {
      this.showFeedback('Não foi possível atualizar a preferência.', 'error');
    }
  }

  public goToPlans(): void {
    this.router.navigate(['/tabs/plans']);
  }

  public goToZones(): void {
    this.router.navigate(['/tabs/zones']);
  }

  public async logout(): Promise<void> {
    try {
      await this.supabaseService.signOut();
    } catch {
      // ignora erro de rede ao sair e limpa sessão local
    }

    localStorage.removeItem(this.nameStorageKey);
    localStorage.removeItem(this.photoStorageKey);
    localStorage.removeItem(this.profileStorageKey);

    this.athleteName = '';
    this.profilePhotoUrl = null;
    this.isEditingProfile = false;
    this.profileForm = {
      fullName: '',
      email: '',
      phone: '',
      city: '',
      age: null,
      height: '',
      weight: '',
      experience: 'Estou começando',
      weeklyFrequency: '3 vezes por semana',
      targetDistance: '5 km'
    };

    await this.router.navigate(['/'], { replaceUrl: true });
  }

  private async loadCloudProfile(): Promise<void> {
    try {
      const user = await this.supabaseService.getCurrentUser();
      if (!user) return;

      const cloudProfile = await this.supabaseService.getProfile();
      if (!cloudProfile) {
        if (user.email && !this.profileForm.email) {
          this.profileForm.email = user.email;
        }
        return;
      }

      this.athleteLevel = cloudProfile.level || 'Iniciante';
      this.profileForm = {
        ...this.profileForm,
        fullName: cloudProfile.full_name || this.profileForm.fullName,
        email: cloudProfile.email || user.email || this.profileForm.email,
        phone: cloudProfile.phone ?? this.profileForm.phone,
        city: cloudProfile.city ?? this.profileForm.city,
        age: cloudProfile.age ?? this.profileForm.age,
        experience: this.mapLevelToExperience(cloudProfile.level),
        targetDistance: cloudProfile.goal_distance || this.profileForm.targetDistance,
        weeklyFrequency: cloudProfile.weekly_frequency
          ? `${cloudProfile.weekly_frequency} vezes por semana`
          : this.profileForm.weeklyFrequency,
        weight: cloudProfile.weight_kg ? String(cloudProfile.weight_kg) : this.profileForm.weight,
        height: cloudProfile.height_cm
          ? (cloudProfile.height_cm / 100).toFixed(2)
          : this.profileForm.height
      };

      this.athleteName = this.profileForm.fullName || 'Atleta CorreJa';
      localStorage.setItem(this.nameStorageKey, this.athleteName);
      localStorage.setItem(this.profileStorageKey, JSON.stringify(this.profileForm));

      if (cloudProfile.avatar_url) {
        this.profilePhotoUrl = cloudProfile.avatar_url;
        localStorage.setItem(this.photoStorageKey, cloudProfile.avatar_url);
      } else {
        this.profilePhotoUrl = null;
        localStorage.removeItem(this.photoStorageKey);
      }

      this.cdr.detectChanges();
    } catch {
      // mantém dados locais caso esteja offline
    }
  }

  private mapExperienceToLevel(experience: string): AthleteLevel {
    const normalized = experience.toLowerCase();
    if (normalized.includes('avanç') || normalized.includes('21') || normalized.includes('experiente')) {
      return 'Avançado';
    }
    if (normalized.includes('intermed') || normalized.includes('10') || normalized.includes('já corro')) {
      return 'Intermediário';
    }
    return 'Iniciante';
  }

  private mapLevelToExperience(level?: AthleteLevel): string {
    if (level === 'Avançado') return 'Corredor avançado';
    if (level === 'Intermediário') return 'Corredor intermediário';
    return 'Estou começando';
  }

  private validateDraft(): boolean {
    const errors: Record<string, string> = {};

    const name = (this.editDraft.fullName ?? '').trim();
    if (!name || name.length < 2) {
      errors['fullName'] = 'Informe seu nome completo.';
    }

    const email = (this.editDraft.email ?? '').trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      errors['email'] = 'Informe um e-mail válido.';
    }

    if (this.editDraft.age !== null && (this.editDraft.age < 10 || this.editDraft.age > 110)) {
      errors['age'] = 'Informe uma idade válida.';
    }

    this.validationErrors = errors;
    return Object.keys(errors).length === 0;
  }

  private loadStoredProfile(): void {
    const savedName = (localStorage.getItem(this.nameStorageKey) ?? '').trim();
    const savedPhoto = localStorage.getItem(this.photoStorageKey);
    const savedProfileRaw = localStorage.getItem(this.profileStorageKey);
    const savedNotifications = localStorage.getItem(this.notificationsStorageKey);

    this.profilePhotoUrl = savedPhoto || null;

    if (savedProfileRaw) {
      try {
        const parsed = JSON.parse(savedProfileRaw) as Partial<UserProfileData>;
        this.profileForm = {
          ...this.profileForm,
          ...parsed
        };
      } catch {
        this.profileForm.fullName = savedName;
      }
    } else {
      this.profileForm = {
        fullName: savedName,
        email: '',
        phone: '',
        city: '',
        age: null,
        height: '',
        weight: '',
        experience: 'Estou começando',
        weeklyFrequency: '3 vezes por semana',
        targetDistance: '5 km'
      };
    }

    if (savedName && !this.profileForm.fullName) {
      this.profileForm.fullName = savedName;
    }

    this.athleteName = this.profileForm.fullName || 'Atleta CorreJa';
    this.profileForm.fullName = this.athleteName;

    if (savedNotifications !== null) {
      this.notificationsEnabled = savedNotifications === 'true';
    }
  }

  private showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.feedbackMessage === message) {
        this.feedbackMessage = '';
        this.cdr.detectChanges();
      }
    }, 4000);
  }
}