import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  pacientes: Observable<any[]>;
  usuarioNombre: string = '';

  constructor(
    private router: Router,
    private dbService: DbService
  ) {}

  ngOnInit() {
    this.dbService.isDbReady().subscribe(isReady => {
      if (isReady) {
        const userId = localStorage.getItem('usuario_id');
        this.usuarioNombre = localStorage.getItem('usuario_nombre') || '';
        if (userId) {
          this.dbService.cargarPacientes(Number(userId));
        }
      }
    });
    this.pacientes = this.dbService.obtenerPacientes();
  }

  ionViewWillEnter() {
    // Se asegura de que los pacientes se recarguen cada vez que se entra a la página
    const userId = localStorage.getItem('usuario_id');
    if (userId) {
      this.dbService.cargarPacientes(Number(userId));
    }
  }

  agregarMascota() {
    this.router.navigate(['/agregar-mascota']);
  }

  logout() {
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('usuario_nombre');
    this.router.navigate(['/login']);
  }
}
