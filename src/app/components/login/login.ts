import { Component, PLATFORM_ID, inject, output, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  close = output<void>();
  openSignup = output<void>();
  loginSuccess = output<void>(); 

  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService); 

  showPassword = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  async onSubmit() {
    if (!isPlatformBrowser(this.platformId)) return; 

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, remember } = this.loginForm.getRawValue();

    try {
      await this.authService.login(email, password, remember);
      alert('¡Has iniciado sesión con éxito!');
      this.loginSuccess.emit(); 
    } catch (error: any) {
      console.error('Error en login:', error);
      alert('Usuario o contraseña incorrectos.');
    }
  }
}