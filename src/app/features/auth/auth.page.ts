import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  arrowForwardOutline,
  checkmarkCircleOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
  personOutline
} from 'ionicons/icons';

interface RegisteredAccount {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonIcon, IonButton],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private readonly accountsStorageKey = 'correja_registered_accounts';
  private readonly activeUserNameKey = 'correja_user_name';
  private readonly activeUserProfileKey = 'correja_user_profile';

  isLoginMode = true;
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
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    },
    { validators: this.passwordsMatchValidator }
  );

  constructor() {
    addIcons({
      alertCircleOutline,
      arrowForwardOutline,
      checkmarkCircleOutline,
      eyeOffOutline,
      eyeOutline,
      lockClosedOutline,
      mailOutline,
      personOutline
    });
  }

  public toggleMode(mode: 'login' | 'register'): void {
    this.isLoginMode = mode === 'login';
    this.showPassword = false;
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public onRegister(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      if (this.registerForm.get('acceptTerms')?.invalid) {
        this.setFeedback('Você precisa aceitar os Termos de uso e a Política de privacidade para criar sua conta.', 'error');
      } else {
        this.setFeedback('Preencha corretamente todos os campos obrigatórios.', 'error');
      }
      return;
    }

    const name = String(this.registerForm.value.name ?? '').trim();
    const email = String(this.registerForm.value.email ?? '').trim().toLowerCase();
    const password = String(this.registerForm.value.password ?? '');

    const accounts = this.getStoredAccounts();
    const alreadyExists = accounts.some((acc) => acc.email.toLowerCase() === email);

    if (alreadyExists) {
      this.setFeedback('Já existe uma conta cadastrada com este e-mail.', 'error');
      return;
    }

    const updatedAccounts: RegisteredAccount[] = [...accounts, { name, email, password }];
    localStorage.setItem(this.accountsStorageKey, JSON.stringify(updatedAccounts));

    this.registerForm.reset({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    });

    this.toggleMode('login');
    this.loginForm.patchValue({ email, password: '' });
    this.setFeedback('Conta criada com sucesso! Entre com seu e-mail e senha.', 'success');
  }

  public onLogin(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.setFeedback('Informe um e-mail e uma senha válidos para entrar.', 'error');
      return;
    }

    const email = String(this.loginForm.value.email ?? '').trim().toLowerCase();
    const password = String(this.loginForm.value.password ?? '');

    const accounts = this.getStoredAccounts();
    const matchedAccount = accounts.find(
      (acc) => acc.email.toLowerCase() === email && acc.password === password
    );

    if (!matchedAccount) {
      this.setFeedback('E-mail ou senha incorretos. Verifique seus dados ou cadastre-se.', 'error');
      return;
    }

    localStorage.setItem(this.activeUserNameKey, matchedAccount.name);
    this.syncProfileStorage(matchedAccount);
    this.authFeedbackMessage = '';
    this.router.navigate(['/tabs/dashboard']);
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private getStoredAccounts(): RegisteredAccount[] {
    try {
      const raw = localStorage.getItem(this.accountsStorageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private syncProfileStorage(account: RegisteredAccount): void {
    try {
      const rawProfile = localStorage.getItem(this.activeUserProfileKey);
      const currentProfile = rawProfile ? JSON.parse(rawProfile) : {};
      const updatedProfile = {
        ...currentProfile,
        fullName: account.name,
        email: account.email
      };
      localStorage.setItem(this.activeUserProfileKey, JSON.stringify(updatedProfile));
    } catch {
      localStorage.setItem(
        this.activeUserProfileKey,
        JSON.stringify({ fullName: account.name, email: account.email })
      );
    }
  }

  private setFeedback(message: string, type: 'success' | 'error'): void {
    this.authFeedbackMessage = message;
    this.authFeedbackType = type;
  }
}