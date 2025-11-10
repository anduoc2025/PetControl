import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nuevacita',
  templateUrl: './nuevacita.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class NuevacitaPage implements OnInit {
  citaForm!: FormGroup;
  editId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.citaForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      edad: [0, [Validators.required, Validators.min(0)]],
      fecha: ['', Validators.required],
      descripcion: ['']
    });

    // Si viene un id en la ruta, cargamos la mascota para editar
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = id;
      this.isEditMode = true;
      this.loadForEdit(id);
    }
  }

  loadForEdit(id: string) {
    const raw = localStorage.getItem('pets');
    const pets = raw ? JSON.parse(raw) : [];
    const p = pets.find((x: any) => x.id === id);
    if (!p) return;

    // rellenar form
    this.citaForm.patchValue({
      nombre: p.nombre || '',
      tipo: p.tipo || '',
      edad: p.edad || 0,
      fecha: p.proxVacuna || '',
      descripcion: p.nota || ''
    });
  }

  async guardarCita() {
    if (this.citaForm.invalid) {
      const t = await this.toastCtrl.create({ message: 'Completa todos los campos obligatorios', duration: 1500 });
      await t.present();
      return;
    }

    const raw = localStorage.getItem('pets');
    const pets = raw ? JSON.parse(raw) : [];

    if (this.isEditMode && this.editId) {
      // actualizar mascota existente
      const idx = pets.findIndex((x: any) => x.id === this.editId);
      if (idx >= 0) {
        pets[idx] = {
          ...pets[idx],
          nombre: this.citaForm.value.nombre,
          tipo: this.citaForm.value.tipo,
          edad: this.citaForm.value.edad,
          proxVacuna: this.citaForm.value.fecha,
          nota: this.citaForm.value.descripcion
        };
        localStorage.setItem('pets', JSON.stringify(pets));
        const t = await this.toastCtrl.create({ message: 'Mascota actualizada', duration: 1200 });
        await t.present();
        this.router.navigate(['/perfil-mascota', this.editId]);
        return;
      }
    }

    // crear nueva mascota
    const id = Math.floor(Math.random() * 1000000).toString();
    const pet = {
      id,
      nombre: this.citaForm.value.nombre,
      tipo: this.citaForm.value.tipo,
      edad: this.citaForm.value.edad,
      proxVacuna: this.citaForm.value.fecha,
      nota: this.citaForm.value.descripcion
    };

    pets.push(pet);
    localStorage.setItem('pets', JSON.stringify(pets));

    const t = await this.toastCtrl.create({ message: 'Mascota guardada', duration: 1200 });
    await t.present();

    this.router.navigate(['/mascotas']);
  }
}
