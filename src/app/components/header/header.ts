import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initializeTestUsers();
    this.updateAuthUI();
    this.setupEventListeners();
  }

  async loadAndOpenModal(fileUrl: string, modalId: string): Promise<void> {
    let modal: HTMLElement | null = document.getElementById(modalId);

    if (!modal) {
      try {
        const response: Response = await fetch(fileUrl);
        if (!response.ok) throw new Error("No se pudo cargar el archivo: " + fileUrl);

        const htmlSnippet: string = await response.text();

        document.body.insertAdjacentHTML("beforeend", htmlSnippet);

        modal = document.getElementById(modalId);

        if (modalId === 'signupModal') {
          this.setupBirthdayValidation();
        }

        if (modal) {
          this.renderer.setStyle(modal, 'display', 'flex');
        }

      } catch (error: any) {
        console.error("Error al cargar el modal " + modalId + ": ", error);
      }
    } else {
      this.renderer.setStyle(modal, 'display', 'flex');
    }
  }

  closeModal(modalId: string): void {
    const modal: HTMLElement | null = document.getElementById(modalId);
    if (modal) {
      this.renderer.setStyle(modal, 'display', 'none');
    }
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: Event): void {
    const loginModal: HTMLElement | null = document.getElementById("loginModal");
    const signupModal: HTMLElement | null = document.getElementById("signupModal");

    if (loginModal && event.target === loginModal) {
      this.closeModal("loginModal");
    } else if (signupModal && event.target === signupModal) {
      this.closeModal("signupModal");
    }
  }

  private setupEventListeners(): void {
    const hamburger: HTMLElement | null = document.getElementById("hamburger");
    const sideMenu: HTMLElement | null = document.getElementById("side-menu");
    const overlay: HTMLElement | null = document.getElementById("overlay");

    if (hamburger && sideMenu && overlay) {
      this.renderer.listen(hamburger, 'click', () => {
        this.renderer.addClass(sideMenu, 'show');
        this.renderer.addClass(overlay, 'show');
      });

      this.renderer.listen(overlay, 'click', () => {
        this.renderer.removeClass(sideMenu, 'show');
        this.renderer.removeClass(overlay, 'show');
      });
    }

    // Event listener for form submits
    this.renderer.listen(document, 'submit', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest('#signupModal form')) {
        event.preventDefault();
        this.handleSignup(event);
      } else if (target.closest('#loginModal form')) {
        event.preventDefault();
        this.handleLogin(event);
      }
    });

    // Event listener for logout
    const logoutButtons = document.querySelectorAll('.btn-danger.normal, #logout-reduce');
    logoutButtons.forEach(button => {
      this.renderer.listen(button, 'click', () => this.handleLogout());
    });

    // Event listener for toggle password
    this.renderer.listen(document, 'click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('toggle-password')) {
        this.togglePasswordVisibility(target);
      }
    });
  }

  updateAuthUI(): void {
    const currentUser: string | null = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

    if (window.location.pathname.includes('user-activities.html') && !currentUser) {
      window.location.href = 'index.html';
      return;
    }

    const authContainer: Element | null = document.querySelector('.auth-buttons');
    const btnSignup: Element | null = document.querySelector('.auth-buttons .btn-primary.normal');
    const btnLogin: Element | null = document.querySelector('.auth-buttons .btn-secondary.normal');
    const btnLoginReduce: HTMLElement | null = document.getElementById('login-reduce');
    const btnLogout: Element | null = document.querySelector('.auth-buttons .btn-danger.normal');
    const btnLogoutReduce: HTMLElement | null = document.getElementById('logout-reduce');

    const myActivitiesLinks: NodeListOf<Element> = document.querySelectorAll('.user-activities');

    if (!btnSignup && myActivitiesLinks.length === 0) return;

    const reviewUserNameDisplay: Element | null = document.querySelector(".review-item .avatar h3");
    if (reviewUserNameDisplay) {
      (reviewUserNameDisplay as HTMLElement).textContent = currentUser ? currentUser : "Inicia sesión para comentar";
    }

    let greetingElement: HTMLElement | null = document.getElementById('user-greeting');
    if (!greetingElement && authContainer) {
      greetingElement = document.createElement('span');
      greetingElement.id = 'user-greeting';
      this.renderer.setStyle(greetingElement, 'marginRight', '15px');
      this.renderer.setStyle(greetingElement, 'fontWeight', 'bold');
      if (btnLogout) {
        authContainer.insertBefore(greetingElement, btnLogout);
      } else {
        authContainer.appendChild(greetingElement);
      }
    }

    if (currentUser) {
      if (btnSignup) this.renderer.setStyle(btnSignup, 'display', 'none');
      if (btnLogin) this.renderer.setStyle(btnLogin, 'display', 'none');
      if (btnLoginReduce) this.renderer.setStyle(btnLoginReduce, 'display', 'none');
      if (btnLogout) this.renderer.setStyle(btnLogout, 'display', '');
      if (btnLogoutReduce) this.renderer.setStyle(btnLogoutReduce, 'display', '');

      if (greetingElement) {
        greetingElement.textContent = `Hola, ${currentUser}`;
        this.renderer.setStyle(greetingElement, 'display', 'inline-block');
      }

      myActivitiesLinks.forEach(link => {
        const parent = link.parentElement;
        if (parent && parent.tagName === 'LI') {
          this.renderer.setStyle(parent, 'display', '');
        } else {
          this.renderer.setStyle(link, 'display', '');
        }
      });

    } else {
      if (btnSignup) this.renderer.setStyle(btnSignup, 'display', '');
      if (btnLogin) this.renderer.setStyle(btnLogin, 'display', '');
      if (btnLoginReduce) this.renderer.setStyle(btnLoginReduce, 'display', '');
      if (btnLogout) this.renderer.setStyle(btnLogout, 'display', 'none');
      if (btnLogoutReduce) this.renderer.setStyle(btnLogoutReduce, 'display', 'none');

      if (greetingElement) {
        this.renderer.setStyle(greetingElement, 'display', 'none');
      }

      myActivitiesLinks.forEach(link => {
        const parent = link.parentElement;
        if (parent && parent.tagName === 'LI') {
          this.renderer.setStyle(parent, 'display', 'none');
        } else {
          this.renderer.setStyle(link, 'display', 'none');
        }
      });
    }
  }

  private handleSignup(event: Event): void {
    const form = event.target as HTMLFormElement;
    const usernameInput = form.elements.namedItem('username') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
    const username: string = usernameInput?.value || '';
    const password: string = passwordInput?.value || '';

    const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find((u: any) => u.username === username)) {
      alert('Este nombre de usuario ya está registrado. Por favor, elige otro.');
      return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('¡Registro exitoso! Ya puedes iniciar sesión.');
    this.closeModal('signupModal');
    this.loadAndOpenModal('login-modal.html', 'loginModal');
  }

  private handleLogin(event: Event): void {
    const form = event.target as HTMLFormElement;
    const usernameInput = form.elements.namedItem('username') as HTMLInputElement;
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
    const rememberInput = form.elements.namedItem('remember') as HTMLInputElement;
    const username: string = usernameInput?.value || '';
    const password: string = passwordInput?.value || '';
    const rememberMe: boolean = rememberInput?.checked || false;

    const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
    const validUser = users.find((u: any) => u.username === username && u.password === password);

    if (validUser) {
      if (rememberMe) {
        localStorage.setItem('currentUser', username);
      } else {
        sessionStorage.setItem('currentUser', username);
      }

      this.closeModal('loginModal');
      this.updateAuthUI();
      alert('¡Has iniciado sesión con éxito!');
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  }

  handleLogout(): void {
    alert('Sesión cerrada');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }

  private async initializeTestUsers(): Promise<void> {
    try {
      const response: Response = await fetch('json/users.json');
      if (response.ok) {
        const testUsers: any[] = await response.json();

        let existingUsers: any[] = JSON.parse(localStorage.getItem('users') || '[]');
        let modified: boolean = false;

        testUsers.forEach((testUser: any) => {
          const exists = existingUsers.find((u: any) => u.username === testUser.username);

          if (!exists) {
            existingUsers.push(testUser);
            modified = true;
          }
        });

        if (modified) {
          localStorage.setItem('users', JSON.stringify(existingUsers));
          console.log("Usuarios de prueba cargados y fusionados con éxito.");
        }
      }
    } catch (error: any) {
      console.error("Error al cargar los usuarios de prueba: ", error);
    }
  }

  private togglePasswordVisibility(icon: HTMLElement): void {
    const inputField: HTMLInputElement | null = icon.parentElement?.querySelector('input') || null;

    if (inputField) {
      if (inputField.type === 'password') {
        inputField.type = 'text';
        this.renderer.removeClass(icon, 'bxs-lock-alt');
        this.renderer.addClass(icon, 'bx-show');
      } else {
        inputField.type = 'password';
        this.renderer.removeClass(icon, 'bx-show');
        this.renderer.addClass(icon, 'bxs-lock-alt');
      }
    }
  }

  private setupBirthdayValidation(): void {
    const birthdayInput: HTMLInputElement | null = document.querySelector('input[name="birthday"]');
    if (!birthdayInput) return;

    const today: string = new Date().toISOString().split("T")[0];
    birthdayInput.setAttribute("max", today);

    this.renderer.listen(birthdayInput, 'input', () => {
      const birthDate: Date = new Date(birthdayInput.value);
      const todayDate: Date = new Date();
      const age: number = todayDate.getFullYear() - birthDate.getFullYear();
      const monthDiff: number = todayDate.getMonth() - birthDate.getMonth();

      let finalAge: number = age;
      if (monthDiff < 0 || (monthDiff === 0 && todayDate.getDate() < birthDate.getDate())) {
        finalAge--;
      }

      if (finalAge < 16) {
        birthdayInput.setCustomValidity("Debes tener al menos 16 años para registrarte.");
      } else {
        birthdayInput.setCustomValidity("");
      }
    });
  }
}
