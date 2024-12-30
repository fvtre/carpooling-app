import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Usuario } from '../interfaces/usuario.interface.';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  usuario: Usuario | null = null;

  constructor(
    private router:Router,
    private navCtrl:NavController,
    private userService: UserService
  
  ) { }

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

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  goBack() {
    this.navCtrl.back();
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
