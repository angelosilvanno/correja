import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
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
  createOutline,
  logOutOutline,
  notificationsOutline,
  optionsOutline,
  personOutline
} from 'ionicons/icons';

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

  private readonly nameStorageKey = 'correja_user_name';
  private readonly profileStorageKey = 'correja_user_profile';
  private readonly photoStorageKey = 'correja_user_photo';
  private readonly notificationsStorageKey = 'correja_notifications_enabled';

  athleteName = '';
  profilePhotoUrl: string | null = null;
  pendingPhotoPreview: string | null = null;
  private previousPhotoUrl: string | null = null;

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

  public ngOnInit(): void {
    this.loadStoredProfile();
  }

  public triggerPhotoPicker(input: HTMLInputElement): void {
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

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (!this.pendingPhotoPreview) {
          this.previousPhotoUrl = this.profilePhotoUrl;
        }
        this.pendingPhotoPreview = reader.result;
        this.profilePhotoUrl = reader.result;
      }
    };
    reader.onerror = () => {
      this.showFeedback('Não foi possível ler a imagem selecionada.', 'error');
    };
    reader.readAsDataURL(file);
  }

  public cancelPhotoChange(input: HTMLInputElement): void {
    this.profilePhotoUrl = this.previousPhotoUrl;
    this.pendingPhotoPreview = null;
    input.value = '';
  }

  public confirmPhotoChange(input: HTMLInputElement): void {
    if (!this.pendingPhotoPreview) return;
    try {
      localStorage.setItem(this.photoStorageKey, this.pendingPhotoPreview);
      this.previousPhotoUrl = this.pendingPhotoPreview;
      this.pendingPhotoPreview = null;
      input.value = '';
      this.showFeedback('Foto de perfil atualizada com sucesso.', 'success');
    } catch {
      this.showFeedback('Não foi possível salvar a imagem no dispositivo.', 'error');
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

  public saveProfileChanges(): void {
    if (!this.validateDraft()) {
      this.showFeedback('Verifique os campos obrigatórios antes de salvar.', 'error');
      return;
    }

    const cleanedFullName = this.editDraft.fullName.trim();
    this.profileForm = {
      ...this.editDraft,
      fullName: cleanedFullName,
      email: this.editDraft.email.trim(),
      phone: this.editDraft.phone.trim(),
      city: this.editDraft.city.trim(),
      height: this.editDraft.height.trim(),
      weight: this.editDraft.weight.trim()
    };

    this.athleteName = cleanedFullName;

    try {
      localStorage.setItem(this.nameStorageKey, cleanedFullName);
      localStorage.setItem(this.profileStorageKey, JSON.stringify(this.profileForm));
      this.isEditingProfile = false;
      this.showFeedback('Informações pessoais atualizadas com sucesso.', 'success');
    } catch {
      this.showFeedback('Erro ao salvar as alterações do perfil.', 'error');
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

  public logout(): void {
    localStorage.removeItem(this.nameStorageKey);
    this.router.navigate(['/auth']);
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
    }

    if (savedName && !this.profileForm.fullName) {
      this.profileForm.fullName = savedName;
    }

    this.athleteName = this.profileForm.fullName || 'Atleta CorreJa';
    this.profileForm.fullName = this.athleteName;

    if (savedPhoto) {
      this.profilePhotoUrl = savedPhoto;
      this.previousPhotoUrl = savedPhoto;
    }

    if (savedNotifications !== null) {
      this.notificationsEnabled = savedNotifications === 'true';
    }
  }

  private showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => {
      if (this.feedbackMessage === message) {
        this.feedbackMessage = '';
      }
    }, 4000);
  }
}