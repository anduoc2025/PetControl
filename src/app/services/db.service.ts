import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  // Observables para los datos
  private pacientes = new BehaviorSubject([]);

  constructor(
    private platform: Platform,
    private sqlite: SQLite
  ) {
    this.platform.ready().then(() => {
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
    });
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
    const data = [nombre, correo, pass];
    return this.db.executeSql('INSERT INTO usuario (nombre, correo, pass) VALUES (?, ?, ?)', data);
  }

  loginUsuario(correo: string, pass: string): Promise<any> {
    return this.db.executeSql('SELECT * FROM usuario WHERE correo = ? AND pass = ?', [correo, pass]).then(data => {
      if (data.rows.length > 0) {
        return Promise.resolve(data.rows.item(0));
      }
      return Promise.resolve(null);
    });
  }

  // --- Métodos de Paciente ---

  almacenarPaciente(nombre: string, especie: string, raza: string, edad: number, foto: string, usuario_id: number): Promise<any> {
    const data = [nombre, especie, raza, edad, foto, usuario_id];
    return this.db.executeSql('INSERT INTO paciente (nombre, especie, raza, edad, foto, usuario_id) VALUES (?, ?, ?, ?, ?, ?)', data).then(() => {
      this.cargarPacientes(usuario_id); // Recargar pacientes después de agregar uno nuevo
    });
  }
  
  cargarPacientes(usuario_id: number) {
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
}
