import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { Usuario } from '../interfaces/usuario.interface.';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  usuario: Usuario | null = null;

  constructor(
    private router: Router,
    private userService:UserService
  ) {}

  async ngOnInit() {
    const email = this.userService.getEmailFromLogin();
    if (email) {
      this.usuario = await this.userService.getUsuarioByEmail(email);
      if (this.usuario) {
        console.log('Usuario recibido en HomePage:', this.usuario)
        this.userService.setUserData(this.usuario);  // Aquí guardas los datos del usuario;
      }
    } else {
      console.log('No se recibió email en HomePage.');
    }
  }

  roleChanged(event: CustomEvent) {
    const role = event.detail.value;
    if (role === 'driver') {
      this.router.navigate(['/driver']);
    } else if (role === 'passenger') {
      this.router.navigate(['/passenger']);
    }
  }

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  faq() {
    this.router.navigate(['/faq']);
  }

  profile() {
    this.router.navigate(['/profile']);
  }

  home() {
    this.router.navigate(['/home']);
  }
}