import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private sqlite: SQLite) { 
    this.crearTablas();
  }

  crearTablas(){
    this.sqlite.create({
      name: 'veterinaria.db', // Nombre acorde a tu proyecto
      location: 'default'
    }).then((db: SQLiteObject) => {
      // Tabla 1: Usuario (Dueño/Admin) - Ya la tenías, la mantenemos
      db.executeSql('CREATE TABLE IF NOT EXISTS usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR, correo VARCHAR, contrasena VARCHAR)', [])
      .then(() => console.log('Tabla USUARIO creada'))
      .catch(e => console.log('Error tabla USUARIO', e));

      // Tabla 2: Pacientes (Mascotas) - NUEVA
      db.executeSql('CREATE TABLE IF NOT EXISTS paciente (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR, especie VARCHAR, raza VARCHAR, edad INTEGER, foto TEXT)', [])
      .then(() => console.log('Tabla PACIENTE creada'))
      .catch(e => console.log('Error tabla PACIENTE', e));

    }).catch(e => console.log(e));
  }

  // Función para guardar una mascota
  almacenarPaciente(nombre: string, especie: string, raza: string, edad: number, foto: string){
    return this.sqlite.create({
      name: 'veterinaria.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('INSERT INTO paciente (nombre, especie, raza, edad, foto) VALUES (?, ?, ?, ?, ?)', [nombre, especie, raza, edad, foto]);
    });
  }

  // Función para obtener mascotas (para listar en el Home)
  obtenerPacientes(){
    return this.sqlite.create({
      name: 'veterinaria.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('SELECT * FROM paciente', []).then((data) => {
        let pacientes = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            pacientes.push(data.rows.item(i));
          }
        }
        return pacientes;
      });
    });
  }
}