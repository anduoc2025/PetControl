import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MascotasService } from '../services/db.service';
import { AppHeaderButton } from '../components/app-header-button.component';

@Component({
  selector: 'app-nuevamascota',
  templateUrl: './nuevamascota.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, AppHeaderButton],
})
export class NuevamascotaPage implements OnInit {
  mascotaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private svc: MascotasService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.mascotaForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      edad: [0, [Validators.required, Validators.min(0)]],
      peso: [null],
      raza: [''],
      color: [''],
      motivo: ['']
    });
  }

  async guardar() {
    if (this.mascotaForm.invalid) {
      const t = await this.toastCtrl.create({ message: 'Completa los campos obligatorios', duration: 1400 });
      await t.present();
      return;
    }

    this.svc.agregarMascota(this.mascotaForm.value);
    const t = await this.toastCtrl.create({ message: 'Mascota agregada', duration: 1000 });
    await t.present();
    this.router.navigate(['/mascotas']);
  }
}
