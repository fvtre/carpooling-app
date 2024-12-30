import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  formLogin: FormGroup;
  errorMessage: string | null = null; // Propiedad para manejar mensajes de error

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {
  }
  
  async onSubmit() {
    this.errorMessage = null;

    try {
        // Intenta iniciar sesión y obtener los datos del usuario
        const response = await this.userService.login(this.formLogin.value);
        
        const email = this.formLogin.value.email; // Recuperar el email desde el formulario
        this.userService.setEmail(email); // Almacenar el email en UserService
        
        if (response) {
            // Si el usuario existe, establece los datos y redirige a home
            this.userService.setUserData(response); // Almacena el objeto usuario completo
            console.log('Email enviado a Home:', email); // Verifica que se envíe el email
            this.router.navigate(['/home']);
        } else {
            // Si el usuario no existe, guarda el email y redirige a crear perfil
            console.log('Email enviado a CreateProfilePage:', email); // Verifica que se envíe el email
            this.router.navigate(['/createprofile']);
        }
    } catch (error) {
        console.log('Error en inicio de sesión:', error);
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
    }
}


  onClick() {
    this.userService.loginWithGoogle()
      .then(response => {
        console.log(response);
        this.router.navigate(['/main']);
      })
      .catch(error => console.log(error));
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToRecoverPassword() {
    this.router.navigate(['/recover-password']);
  }
}
