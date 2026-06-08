
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimationController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PetService } from '../services/pet.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements AfterViewInit {
  // Referencia a la tarjeta del login para animarla
  @ViewChild('loginCard', { read: ElementRef }) loginCard!: ElementRef;

  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private petService: PetService,
    private animationCtrl: AnimationController,
    private toastCtrl: ToastController
  ) {
    // ===== Formulario reactivo con validación =====
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // ===== ANIMACIÓN IONIC #1: fade + slide al cargar la página =====
  ngAfterViewInit() {
    const animation = this.animationCtrl
      .create()
      .addElement(this.loginCard.nativeElement)
      .duration(700)
      .easing('ease-out')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(40px)', 'translateY(0px)');
    animation.play();
  }

  // Atajos para mostrar errores en el HTML
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;
    if (this.petService.login(email, password)) {
      this.router.navigate(['/home']);
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Correo o contraseña incorrectos. Usa demo@petcontrol.cl / 123456',
        duration: 2500,
        color: 'danger',
        position: 'top',
      });
      toast.present();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}