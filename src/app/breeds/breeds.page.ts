import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-breeds',
  templateUrl: './breeds.page.html',
  styleUrls: ['./breeds.page.scss'],
  standalone: false,
})
export class BreedsPage implements OnInit {
  breeds: string[] = [];
  favoritos: string[] = [];
  loading = true;
  offline = false;
  selectedImage = '';
  selectedBreed = '';

  constructor(
    private api: ApiService,
    private toastCtrl: ToastController,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.loadBreeds();
    this.cargarFavoritos();
  }

  // ===== GET con manejo de errores =====
  loadBreeds() {
    this.loading = true;
    this.api.getBreeds().subscribe({
      next: async (res) => {
        this.breeds = Object.keys(res.message);
        this.offline = false;
        await this.api.cacheBreeds(this.breeds);
        this.loading = false;
      },
      error: async (err) => {
        this.breeds = await this.api.getCachedBreeds();
        this.offline = true;
        this.loading = false;
        await this.mostrar(err.message || 'Sin conexión: mostrando razas guardadas.', 'warning');
      },
    });
  }

  showImage(breed: string) {
    this.selectedBreed = breed;
    this.selectedImage = '';
    this.api.getBreedImage(breed).subscribe({
      next: (res) => (this.selectedImage = res.message),
      error: async (err) => {
        await this.mostrar(err.message || 'No se pudo cargar la imagen.', 'danger');
      },
    });
  }

  // ===== POST + guardar el favorito localmente =====
  enviarFavorito() {
    if (!this.selectedBreed) {
      this.mostrar('Primero selecciona una raza.', 'warning');
      return;
    }
    this.api.enviarFavorito(this.selectedBreed).subscribe({
      next: async () => {
        await this.guardarFavorito(this.selectedBreed);
        await this.mostrar(`"${this.selectedBreed}" agregada a favoritas ✅`, 'success');
      },
      error: async (err) => {
        await this.mostrar(err.message || 'No se pudo enviar.', 'danger');
      },
    });
  }

  // Guarda el favorito en el teléfono (sin repetir)
  async guardarFavorito(breed: string) {
    if (!this.favoritos.includes(breed)) {
      this.favoritos.push(breed);
      await this.storage.set('favoritos', this.favoritos);
    }
  }

  // Carga los favoritos guardados al abrir la página
  async cargarFavoritos() {
    this.favoritos = (await this.storage.get('favoritos')) || [];
  }

  // Quitar un favorito de la lista
  async quitarFavorito(breed: string) {
    this.favoritos = this.favoritos.filter((f) => f !== breed);
    await this.storage.set('favoritos', this.favoritos);
    await this.mostrar(`"${breed}" eliminada de favoritas`, 'medium');
  }

  private async mostrar(mensaje: string, color: string) {
    const t = await this.toastCtrl.create({
      message: mensaje, duration: 2500, color, position: 'top',
    });
    t.present();
  }
}