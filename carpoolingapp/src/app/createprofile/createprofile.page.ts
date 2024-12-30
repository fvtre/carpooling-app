import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../interfaces/usuario.interface.';

@Component({
  selector: 'app-createprofile',
  templateUrl: './createprofile.page.html',
  styleUrls: ['./createprofile.page.scss'],
})
export class CreateProfilePage implements OnInit {
  formProfile: FormGroup;
  email:string|undefined;
  constructor(private userService: UserService, private router: Router) {
    // Inicialización del formulario
    this.formProfile = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      usuario: new FormControl('', [Validators.required]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      esConductor: new FormControl(false),
      patente: new FormControl(''),
      modeloAuto: new FormControl(''),
    });
  }

  ngOnInit() {
    // Obtiene el email desde UserService y lo establece en el formulario
    const email = this.userService.getEmailFromLogin();
    if (email) {
      console.log('Email recibido en CreateProfilePage:', email); // Agrega este console.log
      this.formProfile.patchValue({ email });
    } else {
      console.log('No se recibió email en CreateProfilePage.');
    }
  }

  onSubmit() {
    if (this.formProfile.valid) {
      this.formProfile.get('email')?.enable();
      const usuario: Usuario = this.formProfile.value;
      console.log('Usuario a guardar:', usuario); // Verifica el contenido
      this.userService.saveUserProfile(usuario)
        .then(() => {
          console.log('Perfil creado exitosamente');
          this.router.navigate(['/home']);
        })
        .catch(error => {
          console.error('Error al crear el perfil:', error);
        });
    } else {
      console.log('Formulario no válido:', this.formProfile.errors); // Verifica errores
    }
  }

  
  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }
}
