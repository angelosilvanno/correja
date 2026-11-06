import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
  sparklesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    IonIcon
  ],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoginMode = true;
  showPassword = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    experienceLevel: ['beginner', Validators.required]
  });

  constructor() {
    addIcons({
      sparklesOutline,
      mailOutline,
      lockClosedOutline,
      personOutline,
      eyeOutline,
      eyeOffOutline,
      arrowForwardOutline
    });
  }

  toggleMode(mode: 'login' | 'register'): void {
    this.isLoginMode = mode === 'login';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    // Autenticação local / mock para o MVP
    this.router.navigate(['/tabs/dashboard']);
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    // Cadastro local / mock para o MVP
    this.router.navigate(['/tabs/dashboard']);
  }

  exploreAsGuest(): void {
    // Permite explorar o app sem conta prévia
    this.router.navigate(['/tabs/dashboard']);
  }
}