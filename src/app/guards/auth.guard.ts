import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PetService } from '../services/pet.service';

// ===== Route Guard (seguridad de Pages) =====
export const authGuard: CanActivateFn = async () => {
  const petService = inject(PetService);
  const router = inject(Router);

  const logged = await petService.isAuthenticated();
  if (logged) {
    return true;
  }
  return router.createUrlTree(['/login']);
};