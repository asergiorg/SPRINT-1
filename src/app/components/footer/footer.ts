import { Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  activeCol = signal<string | null>(null);
  innerWidth = signal<number>(1024); 
  
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.innerWidth.set(window.innerWidth);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.innerWidth.set(window.innerWidth);
      if (this.innerWidth() > 767) {
        this.activeCol.set(null);
      }
    }
  }

  toggleCol(colName: string) {
    if (this.innerWidth() <= 767) {
      this.activeCol.update(current => current === colName ? null : colName);
    }
  }
}
