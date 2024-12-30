import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavController,AlertController } from '@ionic/angular';
import { UserService } from '../service/user.service';
import { Usuario } from '../interfaces/usuario.interface.';
import { ViajesService } from '../service/viajes.service';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Viaje } from '../interfaces/viaje.interface'; // Importa la interfaz Viaje


declare var google: any;

@Component({
  selector: 'app-schedule-trip',
  templateUrl: './schedule-trip.page.html',
  styleUrls: ['./schedule-trip.page.scss'],
})
export class ScheduleTripPage implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  mapa: any;
  marker: any;
  puntoreferencia: { lat: number; lng: number } = { lat: 0, lng: 0 };
  directionsService: any;
  directionsRenderer: any;
  indicaciones: any[] = []; // Cambiado a tipo array de objetos
  destinos: string[] = [];
  tiempoTotal: string = '';
  distanciaTotal: string = '';
  maxDestinos = 5;
  search: any;
  direccion: string = '';
  private html5QrCode: Html5QrcodeScanner | null = null;
  isCameraPermissionGranted: boolean = false;
  viajeId:any;
  viajeVigente: Viaje | null | undefined = null; // Permitir undefined
  miDestino: any;




  constructor(
    private router: Router,
    private navCtrl: NavController,
    private alertController:AlertController,
    private userService: UserService,
    private viajesService: ViajesService 
  ) {}

  

  async ngOnInit() {
    if (typeof google === 'undefined') {
      console.error('Mapa no se cargó. Asegúrate de que la API de Google Maps esté correctamente configurada.');
      return;
    }
    this.dibujarMapa();
    this.obtenerUbicacionActual();
    this.buscarDireccion(this.mapa,this.marker);

    const email = this.userService.getEmailFromLogin();
    if (email) {
      this.usuario = await this.userService.getUsuarioByEmail(email);
      if (this.usuario) {
        console.log('Usuario recibido en HomePage:', this.usuario);
        console.log('viaje recibido en schedule trip:',this.viajeId.id );
        this.userService.setUserData(this.usuario);  
      }
    } else {
      console.log('No se recibió email en HomePage.');
    }
  }

  obtenerUbicacionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        this.puntoreferencia.lat = position.coords.latitude;
        this.puntoreferencia.lng = position.coords.longitude;
        this.actualizarMapa();
        this.marcarUbicacionActual();
      }, (error) => {
        console.error('Error al obtener la ubicación:', error);
        alert("No se pudo obtener la ubicación actual.");
      });
    } else {
      alert("Geolocalización no está soportada por este navegador.");
    }
  }

  actualizarMapa() {
    this.mapa.setCenter(this.puntoreferencia);
    this.marcarUbicacionActual();
  }

  marcarUbicacionActual() {
    if (this.marker) {
      this.marker.setPosition(this.puntoreferencia);
    } else {
      this.marker = new google.maps.Marker({
        position: this.puntoreferencia,
        map: this.mapa,
      });
    }
  }

  dibujarMapa() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.mapa = new google.maps.Map(mapElement, {
        center: this.puntoreferencia,
        zoom: 15,
      });

      this.marker = new google.maps.Marker({
        position: this.puntoreferencia,
        map: this.mapa,
      });

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.mapa);
    }
  }

  buscarDireccion(mapaLocal:any, marcadorLocal:any ) {
    const input = document.getElementById('autocomplete') as HTMLInputElement | null;
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      this.search = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place =autocomplete.getPlace().geometry.location;
        if (place.geometry && place.geometry.location) {
          const location = place.geometry.location;
          mapaLocal.setCenter(place);
          mapaLocal.setZoom(13); 
          marcadorLocal.setPosition(place);
          this.calcularRuta();
        } else {
          alert("No se pudo obtener la ubicación del lugar seleccionado.");
        }
      });
    } else {
      alert('Elemento autocomplete no encontrado');
    }
  }
  

  agregarDestino() {
    const input = document.getElementById('autocomplete') as HTMLInputElement;
    const destino = input.value;

    if (!destino) {
      alert("Por favor, ingresa una dirección.");
      return;
    }

    if (this.destinos.length < this.maxDestinos) {
      this.destinos.push(destino);
      input.value = ''; 
      alert(`Destino ${destino} agregado. Total de destinos: ${this.destinos.length}`);
    } else {
      alert(`Solo se permiten hasta ${this.maxDestinos} destinos.`);
    }
  }


  calcularRuta() {
    if (this.destinos.length === 0) {
      alert("Por favor, agrega al menos una dirección.");
      return;
    }

    this.miDestino=this.usuario?.direccion+' '+this.usuario?.comuna;

    this.destinos.push(this.miDestino)
    
    const waypoints = this.destinos.slice(0, -1).map((d) => ({ location: d, stopover: true }));
    
    const request = {
      origin: this.puntoreferencia,
      destination: this.destinos[this.destinos.length - 1],
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result: any, status: string) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
        this.extraerIndicaciones(result); // Extraer indicaciones
        this.marcarDestinos(result);
      } else {
        alert("No se pudo calcular la ruta: " + status);
      }
    });
  }

  extraerIndicaciones(result: any) {
    this.indicaciones = []; // Reiniciar el arreglo de indicaciones

    const pasos = result.routes[0].legs[0].steps;
    for (let paso of pasos) {
      const instrucciones = paso.instructions;
      const location = paso.end_location; // Obtén la ubicación del paso
      const distancia = paso.distance.text;
      const duracion = paso.duration.text;

      // Almacena cada indicación como un objeto
      this.indicaciones.push({ instrucciones, location, distancia, duracion });
    }
  }

  marcarDestinos(result: any) {
    const ordenDestinos = result.routes[0].legs[0].via_waypoints;

    ordenDestinos.forEach((waypoint: any, index: number) => {
      const location = waypoint.location;
      new google.maps.Marker({
        position: location,
        map: this.mapa,
        label: (index + 1).toString(),
      });
    });

    const finalDestination = result.routes[0].legs[0].end_location;
    new google.maps.Marker({
      position: finalDestination,
      map: this.mapa,
      label: (this.destinos.length).toString(),
    });
  }

  goToStep(index: number) {
    const location = this.indicaciones[index].location; // Ahora location es un objeto
    this.mapa.setCenter(location);
    this.mapa.setZoom(15);
    this.marker.setPosition(location);
  }

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  requestCameraPermission() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.isCameraPermissionGranted = true;
          this.startScanner();
        })
        .catch((error) => {
          this.mostrarError("Error al solicitar permisos de cámara");
        });
    } else {
      this.mostrarError("Navegador no soporta el acceso a la cámara");
    }
  }

  startScanner() {
    const config = {
      fps: 10,
      qrbox: 250,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };
  
    this.html5QrCode = new Html5QrcodeScanner("reader", config, false);
  
    this.html5QrCode.render((result) => {
      // Detener el escáner después de un escaneo exitoso
      this.html5QrCode!.clear(); // Detiene el escáner
      this.direccion = result;
      console.log("Resultado del scanner", result);
      this.mostrarAlertaDireccion();
    }, (error) => {
      console.warn("Error al escanear el código QR", error);
    });
  }
  

  async mostrarAlertaDireccion() {
    const alert = await this.alertController.create({
      header: 'Dirección escaneada',
      message: `¿Deseas agregar esta dirección: ${this.direccion}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.direccion = '';
          }
        },
        {
          text: 'Agregar',
          handler: () => {
            this.agregarDestinoEscaneado();
          }
        }
      ]
    });

    await alert.present();
  }

  agregarDestinoEscaneado() {
    if (this.direccion && this.destinos.length < this.maxDestinos) {
      this.destinos.push(this.direccion);
      this.direccion = '';
      console.log(`Destino escaneado agregado. Total de destinos: ${this.destinos.length}`);
    } else if (this.destinos.length >= this.maxDestinos) {
      this.mostrarError(`Solo se permiten hasta ${this.maxDestinos} destinos.`);
    }
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnDestroy() {
    if (this.html5QrCode) {
      this.html5QrCode.clear();
    }
  }

  async finalizarViaje() {
    const viajes = await this.viajesService.getViajes();
    this.viajeVigente = viajes.find(viaje => viaje.estado === true && viaje.conductor === this.usuario?.nombre);
    if (this.viajeVigente && this.viajeVigente.id) { // Asegúrate de que id no sea undefined
      await this.viajesService.updateViaje(this.viajeVigente.id, { evaluar: true });
      console.log('Viaje Finalizado:', this.viajeVigente);
      this.viajeVigente = null; // Limpiar viaje vigente después de cancelarlo
      
      // Redirigir a la página de inicio
      this.router.navigate(['/home']);
    } else {
      console.log('No hay viaje vigente para cancelar.');
    }
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
