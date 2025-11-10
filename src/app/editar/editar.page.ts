import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotasService } from '../services/mascotas.service';
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
    private svc: MascotasService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const m = this.svc.getMascotaById(this.id);
    this.mascotaForm = this.fb.group({
      id: [m?.id],
      nombre: [m?.nombre || '', Validators.required],
      tipo: [m?.tipo || '', Validators.required],
      edad: [m?.edad || 0, [Validators.required, Validators.min(0)]],
      peso: [m?.peso ?? null],
      raza: [m?.raza || ''],
      color: [m?.color || ''],
      motivo: [m?.motivo || '']
    });
  }

  async guardar() {
    if (this.mascotaForm.invalid) {
      const t = await this.toastCtrl.create({ message: 'Completa los campos obligatorios', duration: 1200 });
      await t.present();
      return;
    }

    this.svc.editarMascota(this.mascotaForm.value);
    const t = await this.toastCtrl.create({ message: 'Mascota actualizada', duration: 1000 });
    await t.present();
    this.router.navigate(['/perfil-mascota', this.id]);
  }
}
