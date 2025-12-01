import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, from } from 'rxjs';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  foto: string;
  usuario_id: number;
}


@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db!: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);
  private useLocalStorage = false;

  // Observables para los datos
  private pacientes = new BehaviorSubject<any[]>([]);

  constructor(
    private platform: Platform,
    private sqlite: SQLite
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        this.useLocalStorage = false;
        this.initSqliteDatabase();
      } else {
        this.useLocalStorage = true;
        this.initLocalStorage();
      }
    });
  }

  private initSqliteDatabase() {
    this.sqlite.create({
      name: 'veterinaria.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.db = db;
      this.createTables().then(() => {
        this.dbReady.next(true);
      });
    })
    .catch(e => console.error('Error opening database', e));
  }

  private initLocalStorage() {
    console.log('Using localStorage for database');
    if (!localStorage.getItem('usuarios')) {
      localStorage.setItem('usuarios', JSON.stringify([]));
    }
    if (!localStorage.getItem('pacientes')) {
      localStorage.setItem('pacientes', JSON.stringify([]));
    }
    this.dbReady.next(true);
  }

  private async createTables() {
    try {
      await this.db.executeSql('CREATE TABLE IF NOT EXISTS usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, correo TEXT UNIQUE, pass TEXT)', []);
      await this.db.executeSql('CREATE TABLE IF NOT EXISTS paciente (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, especie TEXT, raza TEXT, edad INTEGER, foto TEXT, usuario_id INTEGER, FOREIGN KEY(usuario_id) REFERENCES usuario(id))', []);
      console.log('Tables created successfully');
    } catch (e) {
      console.error('Error creating tables', e);
    }
  }

  isDbReady(): Observable<boolean> {
    return this.dbReady.asObservable();
  }

  // --- Métodos de Usuario ---

  registrarUsuario(nombre: string, correo: string, pass: string): Promise<any> {
    if (this.useLocalStorage) {
      return new Promise((resolve, reject) => {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        if (usuarios.find((u: any) => u.correo === correo)) {
          return reject({ message: 'UNIQUE constraint failed' });
        }
        const newUser = { id: usuarios.length + 1, nombre, correo, pass };
        usuarios.push(newUser);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        resolve({ rowsAffected: 1 });
      });
    }

    const data = [nombre, correo, pass];
    return this.db.executeSql('INSERT INTO usuario (nombre, correo, pass) VALUES (?, ?, ?)', data);
  }

  loginUsuario(correo: string, pass: string): Promise<any> {
    if (this.useLocalStorage) {
      return new Promise(resolve => {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const user = usuarios.find((u: any) => u.correo === correo && u.pass === pass);
        resolve(user || null);
      });
    }

    return this.db.executeSql('SELECT * FROM usuario WHERE correo = ? AND pass = ?', [correo, pass]).then(data => {
      if (data.rows.length > 0) {
        // En localStorage, devolvemos el objeto directamente, así que aquí hacemos lo mismo.
        return Promise.resolve(data.rows.item(0));
      }
      return Promise.resolve(null);
    });
  }

  // --- Métodos de Paciente ---

  almacenarPaciente(nombre: string, especie: string, raza: string, edad: number, foto: string, usuario_id: number): Promise<any> {
    if (this.useLocalStorage) {
      return new Promise(resolve => {
        const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
        const newPaciente = { id: pacientes.length + 1, nombre, especie, raza, edad, foto, usuario_id };
        pacientes.push(newPaciente);
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        this.cargarPacientes(usuario_id);
        resolve({ rowsAffected: 1 });
      });
    }
    
    const data = [nombre, especie, raza, edad, foto, usuario_id];
    return this.db.executeSql('INSERT INTO paciente (nombre, especie, raza, edad, foto, usuario_id) VALUES (?, ?, ?, ?, ?, ?)', data).then(() => {
      this.cargarPacientes(usuario_id); // Recargar pacientes después de agregar uno nuevo
    });
  }
  
  cargarPacientes(usuario_id: number) {
    if (this.useLocalStorage) {
      const allPacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
      const userPacientes = allPacientes.filter((p: any) => p.usuario_id === usuario_id);
      this.pacientes.next(userPacientes);
      return Promise.resolve();
    }
    
    return this.db.executeSql('SELECT * FROM paciente WHERE usuario_id = ?', [usuario_id]).then(data => {
      let pacientesArray = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          pacientesArray.push(data.rows.item(i));
        }
      }
      this.pacientes.next(pacientesArray);
    });
  }

  obtenerPacientes(): Observable<any[]> {
    return this.pacientes.asObservable();
  }

  getMascotaById(id: number): Mascota | undefined {
    const currentPacientes = this.pacientes.getValue();
    return currentPacientes.find(p => p.id === id);
  }

  editarMascota(mascota: Mascota): Promise<any> {
    if (this.useLocalStorage) {
      return new Promise(resolve => {
        let pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
        pacientes = pacientes.map((p: Mascota) => p.id === mascota.id ? mascota : p);
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        this.cargarPacientes(mascota.usuario_id);
        resolve({ rowsAffected: 1 });
      });
    }

    const { id, nombre, especie, raza, edad, foto, usuario_id } = mascota;
    return this.db.executeSql('UPDATE paciente SET nombre = ?, especie = ?, raza = ?, edad = ?, foto = ? WHERE id = ?', [nombre, especie, raza, edad, foto, id]).then(() => {
      this.cargarPacientes(usuario_id);
    });
  }
}