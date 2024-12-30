import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Usuario } from '../interfaces/usuario.interface.';
import { UserService } from '../service/user.service';
import { ViajesService } from '../service/viajes.service';
import { Viaje } from '../interfaces/viaje.interface';


@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.page.html',
  styleUrls: ['./passenger.page.scss'],
})
export class PassengerPage implements OnInit{

  usuario: Usuario | null = null;
  viajes: any[] = []; // Lista de viajes
  viajesFiltrados: any[] = []; // Viajes después de aplicar el filtro
  comunas: string[] = []; // Comunas disponibles para el filtro
  selectedComuna: string = ''; // Comuna seleccionada
  viajeVigente: any = null; // Viaje vigente (si existe)

// Propiedades para guardar el índice del viaje agendado y los asientos reservados
viajeAgendadoIndex: number | null = null;
asientosReservados: number | null = null;
viajeAgendado: Viaje | null = null; // Cambiar a un solo objeto Viaje
asientosReservadosUsuario: any;
tieneViajeAgendado: boolean=false;


  constructor(
    private router: Router,
    private navCtrl: NavController,
    private userService:UserService,
    private alertController: AlertController,
    private viajesService: ViajesService
  
  ) {}

  async ngOnInit() {

    this.cargarViajeAgendado();

    const email = this.userService.getEmailFromLogin();
    if (email) {
      this.usuario = await this.userService.getUsuarioByEmail(email);
      if (this.usuario) {
        console.log('Usuario recibido en Passenger:', this.usuario.id)
        console.log('viajevigente: ', this.viajeVigente)
        this.userService.setUserData(this.usuario);  // Aquí guardas los datos del usuario;
      }
    } else {
      console.log('No se recibió email en HomePage.');
    }

    // valida si tiene viaje agendado
  if (this.tieneViajeAgendado){
    alert('ya tienes un viaje agendado, cancelalo para poder agendar uno nuevo o modificarlo')
    this.router.navigate(['/scheduled-trips'])
    }
    else 
    {
      alert('no tienes viajes previos, agenda con tranquilidad')
      const viajes = await this.viajesService.getViajes();
    
    // Filtrar solo los viajes con estado true (vigente)
    const viajesVigentes = viajes.filter(viaje => viaje.estado === true);
    if(viajesVigentes){
    this.cargarViajeVigente();
    }else{
      console.log('no hay viajes vigentes')
    }
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
        this.tieneViajeAgendado=true
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

// Obtener los viajes vigentes desde el servicio
async cargarViajeVigente() {
  try {
    const viajes = await this.viajesService.getViajes();
    
    // Filtrar solo los viajes con estado true (vigente)
    const viajesVigentes = viajes.filter(viaje => viaje.estado === true);

    if (viajesVigentes.length > 0) {
      console.log('Viajes vigentes encontrados:', viajesVigentes);
    } else {
      console.log('No hay viajes vigentes.');
    }

    // Actualizar las listas de viajes y comunas disponibles para el filtro
    this.viajes = viajesVigentes;
    this.viajesFiltrados = viajesVigentes; // Inicialmente muestra solo los viajes vigentes
    this.comunas = [...new Set(viajesVigentes.map(viaje => viaje.comuna))]; // Obtener comunas únicas para el filtro
  } catch (error) {
    console.error('Error al cargar el viaje vigente:', error);
  }
}


  // Filtrar los viajes por comuna seleccionada
  filterTripsByComuna() {
    if (this.selectedComuna) {
      this.viajesFiltrados = this.viajes.filter(viaje => viaje.comuna === this.selectedComuna);
    } else {
      this.viajesFiltrados = this.viajes; // Si no hay comuna seleccionada, mostrar todos los viajes
    }
  }

  
  // Agendar viaje
  async agendarViaje(viaje: any) {
    const alert = await this.alertController.create({
      header: 'Agendar Viaje',
      inputs: [
        {
          name: 'asientos',
          type: 'number',
          min: 1,
          max: viaje.asientosDisponibles,
          placeholder: `Asientos disponibles: ${viaje.asientosDisponibles}`
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agendar',
          handler: (data) => {
            if (data.asientos <= viaje.asientosDisponibles) {
              // Agendar el viaje y actualizar el número de asientos disponibles
              this.viajesService.agendarViaje(viaje.id, data.asientos).then(() => {
                this.actualizarViaje(viaje, data.asientos);
                this.setViajeAgendadoIndex(viaje.id); // Guardar el índice del viaje agendado
                this.setAsientosReservados(data.asientos); // Guardar los asientos reservados
                this.router.navigate(['/scheduled-trips']);
              });
            } else {
              this.mostrarError('No puedes agendar más asientos de los disponibles.');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Actualizar los datos del viaje después de agendar asientos
  actualizarViaje(viaje: any, asientosAgendados: number) {
    viaje.asientosDisponibles -= asientosAgendados;
    // Si no quedan asientos disponibles, eliminar el viaje de la lista filtrada
    if (viaje.asientosDisponibles === 0) {
      this.viajesFiltrados = this.viajesFiltrados.filter(v => v.id !== viaje.id);
    }
  }

  // Mostrar mensaje de error
  async mostrarError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  qrData: string = '';
  createdCode: string = '';

  generateQRCode() {
    if (this.usuario && this.usuario.direccion) {
      this.qrData = this.usuario.direccion + ' ' + this.usuario.comuna; // Usa la dirección del usuario como contenido del QR
      this.createdCode = this.qrData; // Asigna el valor a createdCode
    } else {
      this.mostrarError('No se pudo obtener la dirección del usuario para generar el QR.');
    }
  }
  

    // Guardar el índice del viaje agendado
    setViajeAgendadoIndex(index: number) {
      this.viajeAgendadoIndex = index;
    }
  
    // Guardar los asientos reservados
    setAsientosReservados(asientos: number) {
      this.asientosReservados = asientos;
    }
  
    

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  viewMyTrip() {
    this.router.navigate(['/scheduled-trips']);
  }

  scheduleTrip() {
    this.router.navigate(['/schedule-trip']);
  }

  scheduledTrips() {
    this.router.navigate(['/scheduled-trips']);
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