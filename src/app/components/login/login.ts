import { Component, PLATFORM_ID, inject, output, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

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

  showPassword = signal(false);

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false]
  });

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (!isPlatformBrowser(this.platformId)) return; 

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password, remember } = this.loginForm.getRawValue();

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const validUser = users.find((u: any) => u.username === username && u.password === password);

    if (validUser) {
        if (remember) {
            localStorage.setItem('currentUser', username);
        } else {
            sessionStorage.setItem('currentUser', username);
        }
        
        alert('¡Has iniciado sesión con éxito!');
        this.loginSuccess.emit(); 
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
  }
}