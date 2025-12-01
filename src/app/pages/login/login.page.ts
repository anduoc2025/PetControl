import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DbService } from '../../services/db.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dbService: DbService,
    private toastController: ToastController
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.dbService.isDbReady().subscribe(isReady => {
      if (isReady) {
        console.log('DB is ready for login page');
      }
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      this.presentToast('Por favor, complete todos los campos correctamente.');
      return;
    }

    const { correo, pass } = this.loginForm.value;

    this.dbService.loginUsuario(correo, pass).then(user => {
      if (user) {
        // Guardar sesión en localStorage
        localStorage.setItem('usuario_id', user.id);
        localStorage.setItem('usuario_nombre', user.nombre);
        this.presentToast(`Bienvenido/a ${user.nombre}`);
        this.router.navigate(['/home']);
      } else {
        this.presentToast('Correo o contraseña incorrectos.');
      }
    }).catch(e => {
      console.error('Error en login', e);
      this.presentToast('Ocurrió un error al intentar iniciar sesión.');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}
