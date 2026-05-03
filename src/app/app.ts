import { Component, signal, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('GrandAventures');
  
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTestUsers();
    }
  }

  async initializeTestUsers() {
    try {
        const response = await fetch('/assets/data/users.json');
        
        if (response.ok) {
            const testUsers = await response.json();
            
            let existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            let modified = false;

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
    } catch (error) {
        console.error("Error al cargar los usuarios de prueba: ", error);
    }
  }
}
