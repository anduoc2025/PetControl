import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-breeds',
  templateUrl: './breeds.page.html',
  styleUrls: ['./breeds.page.scss'],
  standalone: false,
})
export class BreedsPage implements OnInit {
  breeds: string[] = [];
  loading = true;
  offline = false;
  selectedImage = '';
  selectedBreed = '';

  constructor(private api: ApiService, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.loadBreeds();
  }

  // ===== Consulta asíncrona a la API REST con .subscribe =====
  loadBreeds() {
    this.loading = true;
    this.api.getBreeds().subscribe({
      next: async (res) => {
        this.breeds = Object.keys(res.message);
        this.offline = false;
        await this.api.cacheBreeds(this.breeds);
        this.loading = false;
      },
      error: async () => {
        // Sin internet (ej. 404): mostramos los datos guardados antes
        this.breeds = await this.api.getCachedBreeds();
        this.offline = true;
        this.loading = false;
        const t = await this.toastCtrl.create({
          message: 'Sin conexión: mostrando razas guardadas.',
          duration: 2500,
          color: 'warning',
          position: 'top',
        });
        t.present();
      },
    });
  }

  showImage(breed: string) {
    this.selectedBreed = breed;
    this.selectedImage = '';
    this.api.getBreedImage(breed).subscribe({
      next: (res) => (this.selectedImage = res.message),
      error: () => (this.selectedImage = ''),
    });
  }
}