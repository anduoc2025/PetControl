import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'agregar-mascota',
    loadComponent: () => import('./pages/agregar-mascota/agregar-mascota.page').then( m => m.AgregarMascotaPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.page').then( m => m.NotFoundPage)
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
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }
];
