import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

// Estructura de una mascota en la base de datos
export interface PetDB {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  sex: string;
  color: string;
  diseases: string;
  photo: string;
  lat?: number;
  lng?: number;
}

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private dbName = 'petcontrol_db';

  // Inicializa la base de datos y crea la tabla si no existe
  async init(): Promise<void> {
    // En web, espera a que jeep-sqlite esté listo
    if (Capacitor.getPlatform() === 'web') {
      await customElements.whenDefined('jeep-sqlite');
    }

    this.db = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);
    await this.db.open();

    // Crea la tabla de mascotas (con SQL)
    const schema = `
      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        species TEXT,
        breed TEXT,
        age INTEGER,
        sex TEXT,
        color TEXT,
        diseases TEXT,
        photo TEXT,
        lat REAL,
        lng REAL
      );
    `;
    await this.db.execute(schema);
  }

  // Obtener todas las mascotas
  async getPets(): Promise<PetDB[]> {
    const res = await this.db.query('SELECT * FROM pets;');
    return res.values as PetDB[];
  }

  // Insertar una mascota nueva (con consulta SQL INSERT)
  async addPet(pet: Omit<PetDB, 'id'>): Promise<void> {
    const sql = `INSERT INTO pets (name, species, breed, age, sex, color, diseases, photo, lat, lng)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    await this.db.run(sql, [
      pet.name, pet.species, pet.breed, pet.age, pet.sex,
      pet.color, pet.diseases, pet.photo, pet.lat ?? null, pet.lng ?? null,
    ]);
    await this.guardarWeb();
  }

  // Contar cuántas mascotas hay (para saber si sembrar las de ejemplo)
  async countPets(): Promise<number> {
    const res = await this.db.query('SELECT COUNT(*) as total FROM pets;');
    return res.values?.[0]?.total ?? 0;
  }

  // En el navegador hay que "guardar" los cambios en el almacén web
  private async guardarWeb(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore(this.dbName);
    }
  }
}