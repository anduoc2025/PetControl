import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

// Login y register son públicos. El resto está protegido por authGuard.
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then((m) => m.RegisterPageModule) },
  { path: 'home', canActivate: [authGuard], loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule) },
  { path: 'add-pet', canActivate: [authGuard], loadChildren: () => import('./add-pet/add-pet.module').then((m) => m.AddPetPageModule) },
  { path: 'pet-detail/:id', canActivate: [authGuard], loadChildren: () => import('./pet-detail/pet-detail.module').then((m) => m.PetDetailPageModule) },
  { path: 'vaccines/:id', canActivate: [authGuard], loadChildren: () => import('./vaccines/vaccines.module').then((m) => m.VaccinesPageModule) },
  { path: 'breeds', canActivate: [authGuard], loadChildren: () => import('./breeds/breeds.module').then((m) => m.BreedsPageModule) },
  { path: 'profile', canActivate: [authGuard], loadChildren: () => import('./profile/profile.module').then((m) => m.ProfilePageModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}