import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../service/user.service'; // Asegúrate de que la ruta es correcta

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user = this.userService.getUserData(); // Obtén el usuario actual

    if (user) {
      return true; // El usuario está autenticado
    } else {
      this.router.navigate(['/login']); // Redirige a la página de login
      return false; // El usuario no está autenticado
    }
  }
}
