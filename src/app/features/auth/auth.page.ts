import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import type {
  AbstractControl,
  FormGroup,
  ValidationErrors
} from '@angular/forms';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  arrowBackOutline,
  arrowForwardOutline,
  checkmarkCircleOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
  personOutline
} from 'ionicons/icons';

import {
  type AthleteLevel,
  type RunnerProfile,
  SupabaseService
} from '../../core/services/supabase.service';

export type AuthViewMode = 'login' | 'register' | 'forgot' | 'reset';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonIcon, IonButton],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  private readonly activeUserNameKey = 'correja_user_name';
  private readonly activeUserProfileKey = 'correja_user_profile';

  authMode: AuthViewMode = 'login';
  isLoginMode = true;
  isSubmitting = false;
  showPassword = false;
  authFeedbackMessage = '';
  authFeedbackType: 'success' | 'error' = 'success';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      level: ['Iniciante', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    },
    { validators: this.passwordsMatchValidator }
  );

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  resetForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordsMatchValidator }
  );

  constructor() {
    addIcons({
      alertCircleOutline,
      arrowBackOutline,
      arrowForwardOutline,
      checkmarkCircleOutline,
      eyeOffOutline,
      eyeOutline,
      lockClosedOutline,
      mailOutline,
      personOutline
    });
  }

  public ngOnInit(): void {
    // Detecta se o usuário abriu o app pelo link de recuperação enviado no e-mail
    if (window.location.hash.includes('type=recovery')) {
      this.toggleMode('reset');
    }

    this.supabaseService.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        this.toggleMode('reset');
        this.cdr.detectChanges();
      }
    });
  }

  public toggleMode(mode: AuthViewMode): void {
    this.authMode = mode;
    this.isLoginMode = mode === 'login';
    this.showPassword = false;
    this.authFeedbackMessage = '';

    if (mode === 'forgot') {
      const typedEmail = String(this.loginForm.value.email ?? '').trim();
      if (typedEmail) {
        this.forgotForm.patchValue({ email: typedEmail });
      }
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public async onForgotPassword(): Promise<void> {
    this.forgotForm.markAllAsTouched();

    if (this.forgotForm.invalid) {
      this.setFeedback('Informe um e-mail válido para receber o link de recuperação.', 'error');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.authFeedbackMessage = '';

    const email = String(this.forgotForm.value.email ?? '').trim().toLowerCase();

    try {
      await this.supabaseService.resetPassword(email);
      this.setFeedback(
        'Enviamos um link de redefinição de senha para o seu e-mail! Verifique sua caixa de entrada ou spam.',
        'success'
      );
    } catch (err: unknown) {
      this.setFeedback(this.translateAuthError(err), 'error');
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  public async onResetPassword(): Promise<void> {
    this.resetForm.markAllAsTouched();

    if (this.resetForm.invalid) {
      if (this.resetForm.errors?.['passwordMismatch']) {
        this.setFeedback('As senhas digitadas não coincidem.', 'error');
      } else {
        this.setFeedback('A nova senha deve ter no mínimo 8 caracteres.', 'error');
      }
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.authFeedbackMessage = '';

    const newPassword = String(this.resetForm.value.password ?? '');

    try {
      await this.supabaseService.updatePassword(newPassword);
      this.resetForm.reset();
      this.setFeedback('Senha atualizada com sucesso! Entrando no seu painel...', 'success');

      setTimeout(async () => {
        this.toggleMode('login');
        await this.router.navigate(['/tabs/dashboard']);
      }, 1500);
    } catch (err: unknown) {
      this.setFeedback(this.translateAuthError(err), 'error');
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  public async onRegister(): Promise<void> {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      if (this.registerForm.get('acceptTerms')?.invalid) {
        this.setFeedback(
          'Você precisa aceitar os Termos de uso e a Política de privacidade para criar sua conta.',
          'error'
        );
      } else {
        this.setFeedback('Preencha corretamente todos os campos obrigatórios.', 'error');
      }
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.authFeedbackMessage = '';

    const name = String(this.registerForm.value.name ?? '').trim();
    const email = String(this.registerForm.value.email ?? '').trim().toLowerCase();
    const level = (this.registerForm.value.level ?? 'Iniciante') as AthleteLevel;
    const password = String(this.registerForm.value.password ?? '');

    try {
      await this.supabaseService.signUp(email, password, name, level);

      this.registerForm.reset({
        name: '',
        email: '',
        level: 'Iniciante',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      });

      this.toggleMode('login');
      this.loginForm.patchValue({ email, password: '' });
      this.setFeedback('Conta criada com sucesso! Entre com seu e-mail e senha.', 'success');
    } catch (err: unknown) {
      this.setFeedback(this.translateAuthError(err), 'error');
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  public async onLogin(): Promise<void> {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.setFeedback('Informe um e-mail e uma senha válidos para entrar.', 'error');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.authFeedbackMessage = '';

    const email = String(this.loginForm.value.email ?? '').trim().toLowerCase();
    const password = String(this.loginForm.value.password ?? '');

    try {
      const user = await this.supabaseService.signIn(email, password);
      const profile = await this.supabaseService.getProfile();

      const displayName =
        profile?.full_name || user?.email?.split('@')[0] || 'Corredor';

      localStorage.setItem(this.activeUserNameKey, displayName);
      this.syncProfileCache(email, displayName, profile);

      this.authFeedbackMessage = '';
      await this.router.navigate(['/tabs/dashboard']);
    } catch (err: unknown) {
      this.setFeedback(this.translateAuthError(err), 'error');
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private syncProfileCache(
    email: string,
    fullName: string,
    profile: RunnerProfile | null
  ): void {
    try {
      const rawProfile = localStorage.getItem(this.activeUserProfileKey);
      const currentProfile = rawProfile ? JSON.parse(rawProfile) : {};
      const updatedProfile = {
        ...currentProfile,
        fullName,
        email,
        level: profile?.level ?? currentProfile.level ?? 'Iniciante',
        activePlanId: profile?.active_plan_id ?? currentProfile.activePlanId ?? '5k'
      };
      localStorage.setItem(this.activeUserProfileKey, JSON.stringify(updatedProfile));
    } catch {
      localStorage.setItem(
        this.activeUserProfileKey,
        JSON.stringify({ fullName, email })
      );
    }
  }

  private translateAuthError(err: unknown): string {
    const message =
      err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();

    if (message.includes('invalid login credentials')) {
      return 'E-mail ou senha incorretos. Verifique seus dados ou cadastre-se.';
    }
    if (message.includes('user already registered')) {
      return 'Já existe uma conta cadastrada com este e-mail.';
    }
    if (message.includes('password should be at least')) {
      return 'A senha deve ter pelo menos 8 caracteres.';
    }
    if (message.includes('email not confirmed')) {
      return 'Confirme seu e-mail antes de entrar ou desative a confirmação no painel.';
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'Muitas tentativas seguidas. Aguarde alguns instantes e tente novamente.';
    }
    return 'Não foi possível concluir a autenticação. Tente novamente.';
  }

  private setFeedback(message: string, type: 'success' | 'error'): void {
    this.authFeedbackMessage = message;
    this.authFeedbackType = type;
  }
}