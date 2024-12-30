import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { UserService } from '../service/user.service';
import { ViajesService } from '../service/viajes.service';
import { Usuario } from '../interfaces/usuario.interface.';
import { Viaje } from '../interfaces/viaje.interface';

@Component({
  selector: 'app-scheduled-trips',
  templateUrl: './scheduled-trips.page.html',
  styleUrls: ['./scheduled-trips.page.scss'],
})
export class ScheduledTripsPage implements OnInit {
  usuario: Usuario | null = null;
  viajeAgendado: Viaje | null = null; // Cambiar a un solo objeto Viaje
  asientosReservadosUsuario: string | null = null;
  evaluar:boolean=false;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private userService: UserService,
    private viajesService: ViajesService
  ) { }


  async ngOnInit() {
    try {
      const email = this.userService.getEmailFromLogin();
      if (email) {
        this.usuario = await this.userService.getUsuarioByEmail(email);
        if (this.usuario) {
          console.log('Usuario recibido en ScheduledTripsPage:', this.usuario);
          this.userService.setUserData(this.usuario);
  
          // Cargar el viaje agendado
          await this.cargarViajeAgendado();
  
          // Obtener el índice y los asientos reservados
          const viajeIndex = this.viajesService.getViajeAgendadoIndex();
          const asientosReservados = this.viajesService.getAsientosReservados();
  
          console.log('Índice del viaje agendado:', viajeIndex);
          console.log('Cantidad de asientos reservados:', asientosReservados);
      
          //solicita evaluar si viaje ha sido finalizado por conductor
          if (this.viajeAgendado?.evaluar){
            this.evaluarViaje();
          }

        } else {
          console.log('No se encontró un usuario con el email proporcionado.');
        }
      } else {
        console.log('No se recibió email en ScheduledTripsPage.');
      }
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }
  }
  
  
  async cargarViajeAgendado() {
    const viajes: Viaje[] = await this.viajesService.getViajes();
    const viajesActivos = viajes.filter(viaje => viaje.estado === true);
  
    const usuarioLogueado = this.userService.getUserData();
    console.log('Usuario logueado carga viaje:', usuarioLogueado);
    
    console.log('Viajes activos:', viajesActivos);
    viajesActivos.forEach(viaje => {
      console.log(`Pasajeros del viaje ${viaje.id}:`, viaje.pasajeros);
      viaje.pasajeros?.forEach(pasajero => {
        console.log(`Asientos reservados para ${pasajero.nombre}:`, pasajero['asientosReservados']);
      });
    });
  
    if (usuarioLogueado && usuarioLogueado.id) {
      this.viajeAgendado = viajesActivos.find(viaje => 
        viaje.pasajeros?.some(pasajero => pasajero.id === usuarioLogueado.id)
      ) || null;
  
      console.log('Viaje agendado encontrado:', this.viajeAgendado);
      
      if (this.viajeAgendado) {
        const pasajeroLogueado = this.viajeAgendado.pasajeros?.find(p => p.id === usuarioLogueado.id);
        this.asientosReservadosUsuario = pasajeroLogueado?.['asientosReservados'] || null;
        console.log('Asientos reservados del usuario logueado:', this.asientosReservadosUsuario);
      }
    } else {
      this.viajeAgendado = null;
      this.asientosReservadosUsuario = null;
      console.log('No hay usuario logueado o usuario no encontrado.');
    }
  }

  async confirmCancel() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: '¿Estás seguro de que quieres cancelar el viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelación abortada');
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.cancelarViaje();
          }
        }
      ]
    });

    await alert.present();
  }

  async cancelarViaje() {
    // Verificar que hay un viaje agendado y que el usuario tiene asientos reservados
    if (this.viajeAgendado && this.asientosReservadosUsuario) {
      try {
        const asientosReservadosArray = this.asientosReservadosUsuario.split(',').map(Number);
        const cantidadAsientosReservados = asientosReservadosArray.length;
  
        // Aumentar la cantidad de asientos disponibles en el viaje
        this.viajeAgendado.asientosDisponibles += Number(this.asientosReservadosUsuario);
        console.log('asiewntos reservados',cantidadAsientosReservados);
  
        // Obtener el ID del usuario logueado
        const usuarioLogueado = this.userService.getUserData();
  
        // Verificar que el usuario esté logueado
        if (usuarioLogueado) {
          const pasajeroId = usuarioLogueado.id;
  
          // Eliminar el pasajero del viaje
          this.viajeAgendado.pasajeros = this.viajeAgendado.pasajeros?.filter(pasajero => pasajero.id !== pasajeroId);
  
          // Verificar que el viaje agendado tenga un ID antes de actualizarlo
          if (this.viajeAgendado.id) {
            // Actualizar el viaje en el servicio
            await this.viajesService.actualizarViaje(this.viajeAgendado.id, this.viajeAgendado);
            console.log('Viaje actualizado con éxito:', this.viajeAgendado);
            
            // Opcional: Navegar a otra página o mostrar un mensaje de éxito
            this.router.navigate(['/home']);
          } else {
            console.error('El viaje agendado no tiene un ID válido.');
          }
        } else {
          console.error('No hay usuario logueado. No se puede cancelar el viaje.');
        }
      } catch (error) {
        console.error('Error al cancelar el viaje:', error);
      }
    } else {
      console.log('No hay viaje agendado o no se han encontrado asientos reservados.');
    }
  }
  

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  
  async evaluarViaje() {
    this.evaluar=true
    console.log('Viaje agendado id a finalizar: ', this.viajeAgendado?.id);

    // Solicitar evaluación del conductor
    const alert = await this.alertController.create({
      header: 'Evalúa al Conductor',
      message: 'Por favor, califica al conductor del 1 al 5',
      inputs: [
        { name: 'rating', type: 'radio', label: '1', value: '1', checked: false },
        { name: 'rating', type: 'radio', label: '2', value: '2', checked: false },
        { name: 'rating', type: 'radio', label: '3', value: '3', checked: true },
        { name: 'rating', type: 'radio', label: '4', value: '4', checked: false },
        { name: 'rating', type: 'radio', label: '5', value: '5', checked: false }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Evaluación cancelada');
          }
        },
        {
          text: 'Enviar',
          handler: (data) => {
            // Insertar la calificación del conductor
            this.insertarCalificacionConductor(Number(data));
          }
        }
      ]
    });

    await alert.present();
  }

  insertarCalificacionConductor(calificacion: number) {
    // Verificar si el viaje agendado es válido
    if (this.viajeAgendado && this.viajeAgendado.id) {
      // Inicializar array de calificación si no existe
      if (!this.viajeAgendado.calificacionConductor) {
        this.viajeAgendado.calificacionConductor = [];
      }

      const usuarioLogueado = this.userService.getUserData();
      if (!usuarioLogueado || !usuarioLogueado.id) {
        console.error('Error: Usuario no está logueado o no tiene un ID válido');
        return;
      }

      console.log('Usuario logueado carga viaje:', usuarioLogueado);

      // Insertar la calificación del conductor
      this.viajeAgendado.calificacionConductor.push({
        idUsuario: usuarioLogueado.id,
        calificacion: calificacion
      });

      console.log(`Calificación agregada al conductor del viaje con ID ${this.viajeAgendado.id}`);

      // Guardar los cambios en la base de datos
      this.guardarCambiosViaje(this.viajeAgendado)
        .then(() => {
          console.log('Cambios guardados exitosamente.');
          this.router.navigate(['/home']);  // Redirigir al home
        })
        .catch((error) => {
          console.error('Error al guardar los cambios del viaje:', error);
        });
    } else {
      console.error('Error: viajeAgendado es null, undefined o no tiene un ID válido');
    }
  }

  guardarCambiosViaje(viaje: Viaje) {
    // Llamar al servicio para actualizar el viaje en Firestore
    return this.viajesService.updateViaje(viaje.id!, viaje);
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
