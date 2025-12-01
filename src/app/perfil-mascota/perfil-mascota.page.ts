import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotasService, Mascota } from '../services/db.service';
import { AppHeaderButton } from '../components/app-header-button.component';

@Component({
  selector: 'app-perfil-mascota',
  templateUrl: './perfil-mascota.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, AppHeaderButton]
})
export class PerfilMascotaPage implements OnInit {
  id!: number;
  pet?: Mascota;

  constructor(private route: ActivatedRoute, private svc: MascotasService, private router: Router) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.pet = this.svc.getMascotaById(this.id);
  }

  volver() { this.router.navigate(['/mascotas']); }

  editar() { this.router.navigate(['/editar', this.id]); }
}
