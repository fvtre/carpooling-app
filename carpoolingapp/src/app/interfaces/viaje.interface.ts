import { Usuario } from "./usuario.interface.";

export interface Calificacion {
  idUsuario: string|undefined;  // ID del usuario que califica
  calificacion: number;  // Valor de la calificación (puede ser un número entre 1 y 5, por ejemplo)
}

export interface Viaje {
  id?: string;
  conductor: string;               // Nombre del conductor
  telefonoConductor: string;       // Teléfono del conductor
  emailConductor: string;          // Correo electrónico del conductor
  direccion: string;               // Dirección del viaje
  comuna: string;                  // Comuna del viaje
  puntoSalida: string;             // Punto de salida
  fecha: string;                   // Fecha del viaje (formato YYYY-MM-DD)
  horaSalida: string;              // Hora de salida (formato HH:mm)
  asientosDisponibles: number;     // Cantidad de asientos disponibles
  pasajeros?: Usuario[];           // Lista de pasajeros (máximo 4)
  
  // Arrays de calificaciones que contienen el ID del usuario y su calificación
  calificacionConductor?: Calificacion[];  // Calificaciones recibidas por el conductor
  calificacionPasajero?: Calificacion[];   // Calificaciones recibidas por los pasajeros
  
  telefonoPasajero?: string;        // Teléfono del pasajero
  emailPasajero?: string;           // Correo electrónico del pasajero
  estado: boolean;                  // Al crear viaje inicia en estado activo
  evaluar: boolean;
}
