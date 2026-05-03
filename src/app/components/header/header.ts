import { Component, OnInit, PLATFORM_ID, inject, signal, HostListener } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router'; 
import { isPlatformBrowser } from '@angular/common'; 
import { Login } from '../login/login'; 
import { Signup } from '../signup/signup'; 

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

  isMenuOpen = signal(false);
  currentUser = signal<string | null>(null);
  activeModal = signal<'login' | 'signup' | null>(null);
  innerWidth = signal(1024);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.innerWidth.set(window.innerWidth);
    }
    this.checkAuthStatus();
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.innerWidth.set(window.innerWidth);
    }
  }

  checkAuthStatus() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser.set(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
    }
  }

  toggleMenu() { this.isMenuOpen.update(v => !v); }
  closeMenu() { this.isMenuOpen.set(false); }

  handleLogout() {
    alert('Sesión cerrada');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
    }
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  openModal(modalType: 'login' | 'signup') {
    this.activeModal.set(modalType);
    this.closeMenu();
  }

  closeModal() { this.activeModal.set(null); }
}