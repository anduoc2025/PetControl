// src/app/mascotas/mascotas.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppHeaderButton } from '../components/app-header-button.component';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
  standalone: true,
  imports: [
    IonicModule,    // contenido y componentes de Ionic (ion-header, ion-button, etc.)
    CommonModule,   // directivas de Angular (*ngFor, *ngIf)
    AppHeaderButton // tu componente del logo (si lo estás usando)
  ]
})
export class MascotasPage {
  mascotas: any[] = [];

  constructor(
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  // Se ejecuta cuando la página se muestra (Ionic): si no se dispara en tu setup,
  // también puedes usar ngOnInit() para la carga inicial.
  ionViewWillEnter() {
    this.loadMascotas();
  }

  // carga desde localStorage
  loadMascotas() {
    const data = localStorage.getItem('mascotas');
    this.mascotas = data ? JSON.parse(data) : [];
  }

  // navega al formulario nuevo
  agregarMascota() {
    this.router.navigate(['/nuevamascota']);
  }

  // editar por índice (tu template lo llama así)
  editarMascota(index: number) {
    // pasamos el índice como query param; en nuevamascota puedes leerlo
    this.router.navigate(['/nuevamascota'], { queryParams: { index } });
  }

  // eliminar y persistir
  async eliminarMascota(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Deseas eliminar esta mascota?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.mascotas.splice(index, 1);
            localStorage.setItem('mascotas', JSON.stringify(this.mascotas));
          }
        }
      ]
    });
    await alert.present();
  }

  // logo / botón home
  goHome() {
    this.router.navigate(['/home']);
  }
}
