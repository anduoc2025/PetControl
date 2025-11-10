import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-button',
  standalone: true,
  imports: [IonicModule],
  template: `
    <div class="app-header-btn" (click)="goHome()" role="button" aria-label="Ir al inicio">
      <img src="assets/img/veterinaria.png" alt="logo" />
    </div>
  `,
  styles: [`
    .app-header-btn {
      position: absolute;
      top: 6px;
      left: 8px;
      width: 44px;
      height: 44px;
      display: inline-block;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      background: transparent;
      z-index: 9999;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .app-header-btn img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    @media (max-width: 420px) {
      .app-header-btn { width: 40px; height: 40px; left: 6px; top: 6px; }
    }
  `]
})
export class AppHeaderButton {
  constructor(private router: Router) {}
  goHome() { this.router.navigate(['/home']); }
}
