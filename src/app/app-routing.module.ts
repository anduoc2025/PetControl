import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// ===== Enrutamiento de la aplicación (NgModules / lazy loading) =====
// El Login es la página principal (ruta por defecto).
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then((m) => m.RegisterPageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'add-pet',
    loadChildren: () => import('./add-pet/add-pet.module').then((m) => m.AddPetPageModule),
  },
  {
    // Paso de parámetro por la URL: /pet-detail/1
    path: 'pet-detail/:id',
    loadChildren: () => import('./pet-detail/pet-detail.module').then((m) => m.PetDetailPageModule),
  },
  {
    path: 'vaccines/:id',
    loadChildren: () => import('./vaccines/vaccines.module').then((m) => m.VaccinesPageModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}