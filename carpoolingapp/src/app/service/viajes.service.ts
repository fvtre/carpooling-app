import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc, query, where, arrayUnion } from 'firebase/firestore';
import { Viaje } from '../interfaces/viaje.interface';
import { Auth } from '@angular/fire/auth';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root',
})
export class ViajesService {

  private firestore = getFirestore(); // Correcto para Firebase v9+
  private viajesRef = collection(this.firestore, 'viajes'); // Colección de viajes en Firestore
  private viajeAgendadoIndex: number | null = null;
  private asientosReservados: number | null = null;
  

  constructor(private auth: Auth,private userService:UserService) {}

  async tieneViajeActivo(conductor: string): Promise<boolean> {
    const q = query(this.viajesRef, where('conductor', '==', conductor), where('estado', '==', true));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Crear viaje
  async addViaje(viaje: Viaje): Promise<void> {
    try {
      await addDoc(this.viajesRef, viaje);
      console.log('Viaje agregado con éxito');
    } catch (error) {
      console.error('Error al agregar viaje: ', error);
    }
  }

  // Obtener todos los viajes
  async getViajes(): Promise<Viaje[]> {
    const viajesSnapshot = await getDocs(this.viajesRef);
    return viajesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Viaje));
  }


  // Obtener un viaje por ID
  async getViajeById(id: string): Promise<Viaje | null> {
    const viajeDocRef = doc(this.firestore, 'viajes', id); // Corregido para Firebase v9
    const viajeDoc = await getDoc(viajeDocRef);

    if (viajeDoc.exists()) {
      return { id: viajeDoc.id, ...viajeDoc.data() } as Viaje;
    } else {
      console.log('No se encontró el viaje con ese ID');
      return null;
    }
  }

  // Actualizar un viaje
  async updateViaje(id: string, viaje: Partial<Viaje>): Promise<void> {
    const viajeDocRef = doc(this.firestore, 'viajes', id); // Corregido para Firebase v9
    await updateDoc(viajeDocRef, { ...viaje });
  }

  // Eliminar un viaje
  async deleteViaje(id: string): Promise<void> {
    const viajeDocRef = doc(this.firestore, 'viajes', id); // Corregido para Firebase v9
    await deleteDoc(viajeDocRef);
  }


  
// Método para agendar un viaje (actualiza la cantidad de asientos disponibles y agrega el ID del usuario, teléfono y email)
async agendarViaje(viajeId: string, asientos: number): Promise<void> {
  const viajeDocRef = doc(this.firestore, 'viajes', viajeId); // Referencia al documento del viaje

  // Obtén el ID del usuario logueado
  const usuarioLogueado = this.userService.getUserData();

  if (usuarioLogueado) {
    // Obtén el viaje actual desde Firebase
    const viajeSnapshot = await getDoc(viajeDocRef);
    const viajeData = viajeSnapshot.data() as Viaje;

    if (viajeData) {
      // Verifica si hay suficientes asientos disponibles antes de proceder
      if (viajeData.asientosDisponibles >= asientos) {
        // Reduce el número de asientos disponibles en el viaje
        const nuevosAsientosDisponibles = viajeData.asientosDisponibles - asientos;

        // Obtén el array actual de pasajeros
        const pasajerosActuales = viajeData.pasajeros || [];

        // Crea un nuevo array de pasajeros agregando los datos del usuario logueado
        const nuevosPasajeros = [
          ...pasajerosActuales,
          ...Array(asientos).fill({
            id: usuarioLogueado.id,
            nombre: usuarioLogueado.nombre,
            email: usuarioLogueado.email,          // Agrega el email del usuario logueado
            telefono: usuarioLogueado.telefono,    // Agrega el teléfono del usuario logueado
            asientosReservados: asientos           // Agrega la cantidad de asientos seleccionados
          })
        ];

        // Actualiza el documento en Firebase
        await updateDoc(viajeDocRef, {
          asientosDisponibles: nuevosAsientosDisponibles, // Actualiza los asientos disponibles
          pasajeros: nuevosPasajeros                      // Reemplaza el array de pasajeros completo
        });
        
        console.log('Viaje agendado correctamente. Pasajeros actualizados:', nuevosPasajeros);
      } else {
        console.error('No hay suficientes asientos disponibles.');
      }
    } else {
      console.error('El viaje no existe.');
    }
  } else {
    console.error('No hay usuario logueado. No se puede agendar el viaje.');
  }
}

// Actualizar un viaje
async actualizarViaje(viajeId: string, viajeActualizado: Partial<Viaje>): Promise<void> {
  // Obtener la referencia al documento específico de la colección 'viajes'
  const viajeDocRef = doc(this.firestore, 'viajes', viajeId);

  try {
    // Actualizar el documento en Firestore
    await updateDoc(viajeDocRef, viajeActualizado);
    console.log('Viaje actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar viaje: ', error);
  }
}

    // Métodos para manejar el índice del viaje agendado
    setViajeAgendadoIndex(index: number) {
      this.viajeAgendadoIndex = index;
    }
  
    getViajeAgendadoIndex(): number | null {
      return this.viajeAgendadoIndex;
    }
  
    // Métodos para manejar los asientos reservados
    setAsientosReservados(asientos: number) {
      this.asientosReservados = asientos;
    }
  
    getAsientosReservados(): number | null {
      return this.asientosReservados;
    }


  
}
