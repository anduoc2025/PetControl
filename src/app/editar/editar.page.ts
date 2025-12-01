import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../services/db.service';
import { AppHeaderButton } from '../components/app-header-button.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, AppHeaderButton],
})
export class EditarPage implements OnInit {
  mascotaForm!: FormGroup;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private svc: DbService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const m = this.svc.getMascotaById(this.id);
    this.mascotaForm = this.fb.group({
      id: [m?.id],
      nombre: [m?.nombre || '', Validators.required],
      especie: [m?.especie || '', Validators.required],
      edad: [m?.edad || 0, [Validators.required, Validators.min(0)]],
      raza: [m?.raza || '']
    });
  }

  async guardar() {
    if (this.mascotaForm.invalid) {
      const t = await this.toastCtrl.create({ message: 'Completa los campos obligatorios', duration: 1200 });
      await t.present();
      return;
    }

    const mascotaOriginal = this.svc.getMascotaById(this.id);
    if (!mascotaOriginal) {
      const t = await this.toastCtrl.create({ message: 'Error: no se encontró la mascota original', duration: 1200 });
      await t.present();
      return;
    }

    const mascotaEditada = {
      ...mascotaOriginal,
      ...this.mascotaForm.value
    };

    await this.svc.editarMascota(mascotaEditada);
    const t = await this.toastCtrl.create({ message: 'Mascota actualizada', duration: 1000 });
    await t.present();
    this.router.navigate(['/perfil-mascota', this.id]);
  }
}
