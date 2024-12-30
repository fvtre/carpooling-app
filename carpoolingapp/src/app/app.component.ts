import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UserService } from './service/user.service';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private userService: UserService,
    private router:Router,
    private menuCtrl: MenuController,  // Inyectar MenuController
    private navCtrl:NavController

  ) {}

  logout() {
    this.userService.logout()
    
      .then(() => {
        this.router.navigate(['/login']);
        this.menuCtrl.close();  // Cerrar el menú
      })
      .catch(error => console.log(error));
  }

    // Método para cerrar el menú cuando se selecciona un ítem
    navigateAndClose(path: string) {
      this.router.navigate([path]);
      this.menuCtrl.close();  // Cerrar el menú
    }

    goBack() {
      this.navCtrl.back();
      this.menuCtrl.close();  // Cerrar el menú
    }

}
