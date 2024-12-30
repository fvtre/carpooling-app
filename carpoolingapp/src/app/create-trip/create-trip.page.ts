import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular'; // Agregar AlertController
import { UserService } from '../service/user.service';
import { Usuario } from '../interfaces/usuario.interface.';
import { ViajesService } from '../service/viajes.service';
import { Viaje } from '../interfaces/viaje.interface';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.page.html',
  styleUrls: ['./create-trip.page.scss'],
})
export class CreateTripPage implements OnInit {
  usuario: Usuario | null = null;

  viaje: Viaje = {
    conductor: '',
    telefonoConductor: '',
    emailConductor: '',
    direccion: '',
    comuna: '',
    puntoSalida: '',
    fecha: '',
    horaSalida: '',
    asientosDisponibles: 0,
    pasajeros: [],
    estado: true,
    evaluar: false,
  };

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private userService: UserService,
    private viajesService: ViajesService,
    private alertController: AlertController // Inyectar AlertController
  ) {}

  ngOnInit() {
    this.usuario = this.userService.getUserData();
    if (this.usuario) {
      this.viaje.conductor = this.usuario.nombre;
      this.viaje.telefonoConductor = this.usuario.telefono;
      this.viaje.emailConductor = this.usuario.email;
    } else {
      console.log('No se encontró usuario en ProfilePage.');
    }
  }

    // Método para verificar si el formulario está completo
    isFormComplete(): boolean {
      return (
        this.viaje.direccion !== '' &&
        this.viaje.comuna.length > 0 && // Verifica que haya al menos una comuna seleccionada
        this.viaje.puntoSalida !== '' &&
        this.viaje.fecha !== '' &&
        this.viaje.horaSalida !== '' &&
        this.viaje.asientosDisponibles > 0 // Asegúrate de que haya asientos seleccionados
      );
    }

  async crearViaje() {
    try {
      // Obtener el email del conductor
      const emailConductor = this.userService.getEmailFromLogin();

      if (!emailConductor) {
        console.error('No se encontró el email del conductor. Asegúrate de haber iniciado sesión.');
        return;
      }

      const conductor = await this.userService.getUsuarioByEmail(emailConductor);

      if (!conductor) {
        console.error('No se encontró el conductor en la base de datos.');
        return;
      }

      // Verificar si el conductor ya tiene un viaje activo
      const tieneViajeActivo = await this.viajesService.tieneViajeActivo(conductor.nombre);

      if (tieneViajeActivo) {
        console.error('Ya tienes un viaje activo. No puedes crear otro hasta que lo finalices.');
        return;
      }

      // Calcular la fecha y hora del viaje
      const fechaViaje = new Date(`${this.viaje.fecha}T${this.viaje.horaSalida}`);
      const fechaActual = new Date();

      // Calcular la diferencia en milisegundos
      const diferenciaEnMilisegundos = fechaViaje.getTime() - fechaActual.getTime();
      const tresHorasEnMilisegundos = 3 * 60 * 60 * 1000; // 3 horas

      // Verificar si el viaje se está creando con menos de 3 horas de anticipación
      if (diferenciaEnMilisegundos < tresHorasEnMilisegundos) {
        await this.presentAlert('No se puede crear el viaje con menos de 3 horas de anticipación.');
        return; // Salir del método si no se cumple la condición
      }

      // Si el número de asientos disponibles es menor que 4, rellena los asientos restantes con el conductor
      const totalAsientos = 4;
      const asientosOcupados = totalAsientos - this.viaje.asientosDisponibles;

      // Rellena los asientos ocupados con el ID del conductor
      this.viaje.pasajeros = Array(asientosOcupados).fill(conductor.id);

      // Crear el viaje
      await this.viajesService.addViaje(this.viaje);

      console.log('Viaje creado con éxito');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al crear viaje: ', error);
    }
  }

  async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
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
