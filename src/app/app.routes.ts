import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'mascotas',
    loadComponent: () => import('./mascotas/mascotas.page').then(m => m.MascotasPage)
  },
  {
    path: 'nuevamascota',
    loadComponent: () => import('./nuevamascota/nuevamascota.page').then(m => m.NuevamascotaPage)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./editar/editar.page').then(m => m.EditarPage)
  },
  {
    path: 'perfil-mascota/:id',
    loadComponent: () => import('./perfil-mascota/perfil-mascota.page').then(m => m.PerfilMascotaPage)
  }
];
