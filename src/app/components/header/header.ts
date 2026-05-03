import { Component, OnInit, PLATFORM_ID, inject, signal, HostListener } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router'; 
import { isPlatformBrowser } from '@angular/common'; 
import { Login } from '../login/login'; 
import { Signup } from '../signup/signup'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, Login, Signup],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService); 

  isMenuOpen = signal(false);
  currentUser = signal<string | null>(null);
  activeModal = signal<'login' | 'signup' | null>(null);
  innerWidth = signal(1024);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.innerWidth.set(window.innerWidth);
    }
    
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUser.set(user.displayName || user.email);
      } else {
        this.currentUser.set(null);
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.innerWidth.set(window.innerWidth);
    }
  }

  toggleMenu() { this.isMenuOpen.update(v => !v); }
  closeMenu() { this.isMenuOpen.set(false); }

  async handleLogout() {
    try {
      await this.authService.logout();
      alert('Sesión cerrada');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  }

  openModal(modalType: 'login' | 'signup') {
    this.activeModal.set(modalType);
    this.closeMenu();
  }

  closeModal() { this.activeModal.set(null); }
}