import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Usuario } from '../interfaces/usuario.interface.';
import { UserService } from '../service/user.service';
import { ViajesService } from '../service/viajes.service'; // Asegúrate de importar el servicio de viajes
import { Viaje } from '../interfaces/viaje.interface'; // Importa la interfaz Viaje

@Component({
  selector: 'app-driver',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {

  usuario: Usuario | null = null;
  viajeVigente: Viaje | null | undefined = null; // Permitir undefined
  viajeAgendado: Viaje | null = null; // Cambiar a un solo objeto Viaje
  viajeVencido: boolean = false; // Nueva variable para controlar el estado del viaje


  constructor(
    private router: Router,
    private navCtrl: NavController,
    private userService: UserService,
    private viajesService: ViajesService, // Inyecta el servicio de viajes
    private alertController: AlertController // Inyectar AlertController

  ) {}

  ngOnInit() {
    this.usuario = this.userService.getUserData();
    if (this.usuario) {
      console.log('Usuario en DriverPage:', this.usuario);
    } else {
      console.log('No se encontró usuario en DriverPage.');
    }

    // Cargar el viaje activo
    this.cargarViajeVigente();
  }

  async cargarViajeVigente() {
    try {
      const viajes = await this.viajesService.getViajes();
      this.viajeVigente = viajes.find(viaje => viaje.estado === true && viaje.conductor === this.usuario?.nombre);
  
      if (this.viajeVigente) {
        console.log('Viaje vigente encontrado:', this.viajeVigente);
        await this.verificarViajeVencido(this.viajeVigente.fecha, this.viajeVigente.horaSalida);
      } else {
        console.log('No hay viajes vigentes.');
      }
    } catch (error) {
      console.error('Error al cargar el viaje vigente:', error);
    }
  }

  
  async verificarViajeVencido(fecha: string, horaSalida: string) {
    const fechaViaje = new Date(`${fecha}T${horaSalida}`);
    const fechaActual = new Date();
    
    const tiempoRestante = fechaViaje.getTime() - fechaActual.getTime();
    const dosHorasEnMilisegundos = 2 * 60 * 60 * 1000; // 2 horas
    const cincoMinutosEnMilisegundos = 5 * 60 * 1000; // 5 minutos
  
    if (fechaViaje < fechaActual) {
      this.viajeVencido = true;
      await this.presentAlert('El viaje está vencido y debe ser cancelado.');
    } else if (tiempoRestante <= (dosHorasEnMilisegundos + cincoMinutosEnMilisegundos) && tiempoRestante > cincoMinutosEnMilisegundos) {
      this.viajeVencido = false;
      await this.presentAlert('Atención: tiene menos 5 minutos para cancelar el viaje, si lo hace despues se le aplicará una multa.');
    } else {
      this.viajeVencido = false;
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
  

  async cancelarViaje() {
    if (this.viajeVigente && this.viajeVigente.id) { // Asegúrate de que id no sea undefined
      await this.viajesService.updateViaje(this.viajeVigente.id, { estado: false });
      console.log('Viaje cancelado:', this.viajeVigente);
      this.viajeVigente = null; // Limpiar viaje vigente después de cancelarlo
      
      // Redirigir a la página de inicio
      this.router.navigate(['/home']);
    } else {
      console.log('No hay viaje vigente para cancelar.');
    }
  }

  viewCurrentTrip() {
    if (this.viajeVigente) {
      console.log('Mostrando viaje agendado:', this.viajeVigente);
      this.router.navigate(['/trip-created']); // Cambia a la página que muestra los detalles del viaje
    } else {
      console.log('No hay un viaje vigente para mostrar.');
    }
  }

  
  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  createTrip() {
    this.router.navigate(['/create-trip']);
  }

    scheduleTrip() {
    this.router.navigate(['/schedule-trip']);
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

  
  async cargarViajeAgendado() {
    const viajes: Viaje[] = await this.viajesService.getViajes();
    const viajesActivos = viajes.filter(viaje => viaje.estado === true);
  
    const usuarioLogueado = this.userService.getUserData();
    console.log('Usuario logueado:', usuarioLogueado); // Muestra el usuario logueado
    
    console.log('Viajes activos:', viajesActivos); // Muestra los viajes activos
    viajesActivos.forEach(viaje => {
      console.log(`Pasajeros del viaje ${viaje.id}:`, viaje.pasajeros); // Muestra los pasajeros de cada viaje
    });
  
    if (usuarioLogueado && usuarioLogueado.id) {
      // Obtener el primer viaje que contenga el ID del usuario logueado en el array de pasajeros
      this.viajeAgendado = viajesActivos.find(viaje => 
        viaje.pasajeros?.some(pasajero => pasajero.id === usuarioLogueado.id)
      ) || null; // Establecer en null si no se encuentra
  
      console.log('Viaje agendado encontrado:', this.viajeAgendado); // Muestra el viaje encontrado
    } else {
      this.viajeAgendado = null; // Establecer en null si no hay usuario
      console.log('No hay usuario logueado o usuario no encontrado.'); // Mensaje si no hay usuario logueado
    }
  }
}
