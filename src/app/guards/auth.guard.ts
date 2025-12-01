import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Lógica para verificar si el usuario está logueado
    // En este caso, revisamos si 'usuario_id' existe en localStorage
    if (localStorage.getItem('usuario_id')) {
      // Si existe, permite el acceso
      return true;
    } else {
      // Si no existe, redirige a la página de login
      console.log('AuthGuard: Acceso denegado, redirigiendo a /login');
      return this.router.parseUrl('/login');
    }
  }
}
