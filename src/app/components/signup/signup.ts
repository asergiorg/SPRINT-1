import { Component, PLATFORM_ID, inject, output, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  close = output<void>();
  openLogin = output<void>();

  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService); 

  showPassword1 = signal(false);
  showPassword2 = signal(false);
  dateInputType = signal('text');

  signupForm = this.fb.nonNullable.group({
    fullname: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[A-Z][a-zA-Z0-9_]{2,19}$/)]],
    birthday: ['', [Validators.required, this.ageValidator]],
    gender: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)]],
    confirm_password: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator });

  private ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    
    return age < 16 ? { underage: true } : null;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirm_password')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  togglePassword(field: number) {
    if (field === 1) this.showPassword1.update(v => !v);
    if (field === 2) this.showPassword2.update(v => !v);
  }

  onDateBlur(event: any) {
    if (!event.target.value) this.dateInputType.set('text');
  }

  async onSubmit() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    try {
      const rawData = this.signupForm.getRawValue();
      await this.authService.register(rawData);
      
      alert('¡Registro exitoso! Ya puedes iniciar sesión.');
      this.openLogin.emit();
    } catch (error: any) {
      console.error('Error al registrar:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('Este correo electrónico ya está registrado. Por favor, elige otro.');
      } else {
        alert('Hubo un error al crear la cuenta. Inténtalo de nuevo.');
      }
    }
  }
}