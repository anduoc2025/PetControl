import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppHeaderButton } from '../components/app-header-button.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, AppHeaderButton]
})
export class HomePage {
  constructor(private router: Router) {}
  goTo(path: string) { this.router.navigate([path]); }
}
