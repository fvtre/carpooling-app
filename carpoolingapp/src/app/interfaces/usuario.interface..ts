export interface Usuario {
    id?:string;
    fotoPerfil:ImageBitmap
    nombre: string;                // Nombre del usuario
    usuario: string;               // Nombre de usuario
    email: string;                 // Correo electrónico
    telefono: string;              // Teléfono en formato +56912345678
    direccion: string;             // Dirección
    comuna:string;                 // comuna
    esConductor: boolean;          // Indica si el usuario es conductor
    patente?: string;              // Patente del auto (opcional)
    modeloAuto?: string;           // Modelo del auto (opcional)
    calificacion?:number           // se califica viaje a viaje
    calificacionpromedio?: number  // crear metodo que inyecte
    asientosReservados?: string; // Añadimos esta línea
  }