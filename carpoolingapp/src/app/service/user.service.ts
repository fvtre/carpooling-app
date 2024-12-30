import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { getFirestore, collection, query, where, getDocs,addDoc } from 'firebase/firestore';
import { Usuario } from '../interfaces/usuario.interface.'; // Asegúrate de tener la ruta correcta

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = getFirestore();
  private viajeAgendadoIndex: number | null = null; // Índice del viaje
  private asientosReservados: number | null = null; // Asientos reservados

  constructor(
    private auth:Auth,
    
  ) { }
  
  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(credentials: { email: string; password: string }): Promise<any> {
    const { email, password } = credentials;

    // Intenta autenticar al usuario
    await signInWithEmailAndPassword(this.auth, email, password);

    // Verifica si el usuario existe en Firestore
    const userRef = collection(this.firestore, 'usuarios');
    const q = query(userRef, where('email', '==', email));
    const userSnapshot = await getDocs(q);

    if (userSnapshot.empty) {
      return null; // El usuario no existe en la base de datos
    }

    return { email }; // Retorna algo si el usuario existe
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }

  private email: string | undefined;
  private currentUser: Usuario | null = null;

  setUserData(usuario: Usuario) {
    this.currentUser = usuario;
  }

  getUserData(): Usuario | null {
    return this.currentUser;
  }

  // Método para establecer el email después del login
  setEmail(email: string) {
    this.email = email;
  }
  
  getEmailFromLogin(): string | undefined {
    return this.email;
  }

  async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    const userRef = collection(this.firestore, 'usuarios');
    const q = query(userRef, where('email', '==', email));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Solo obtenemos el primer resultado
      return { id: userDoc.id, ...userDoc.data() } as Usuario;
    } else {
      console.log('No se encontró un usuario con ese email.');
      return null;
    }
  }

  async saveUserProfile(usuario: Usuario) {
    // Aquí puedes agregar lógica para manejar la foto de perfil si es necesario
    const userRef = collection(this.firestore, 'usuarios');
    await addDoc(userRef, usuario);
  }

}
