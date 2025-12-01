import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from '../../services/db.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class RegistroPage implements OnInit {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dbService: DbService,
    private toastController: ToastController
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      confirmPass: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
  }

  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('pass')!.value;
    const confirmPass = form.get('confirmPass')!.value;
    return pass === confirmPass ? null : { mismatch: true };
  }

  registrar() {
    if (this.registroForm.invalid) {
      if (this.registroForm.errors?.['mismatch']) {
        this.presentToast('Las contraseñas no coinciden.');
      } else {
        this.presentToast('Por favor, complete todos los campos correctamente.');
      }
      return;
    }

    const { nombre, correo, pass } = this.registroForm.value;

    this.dbService.registrarUsuario(nombre, correo, pass).then(() => {
      this.presentToast('Usuario registrado exitosamente. Ahora puede iniciar sesión.');
      this.router.navigate(['/login']);
    }).catch(e => {
      console.error('Error en registro', e);
      if (e.message.includes('UNIQUE constraint failed')) {
        this.presentToast('El correo electrónico ya está registrado.');
      } else {
        this.presentToast('Ocurrió un error durante el registro.');
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'bottom'
    });
    toast.present();
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
