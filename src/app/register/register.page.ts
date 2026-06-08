
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PetService } from '../services/pet.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private petService: PetService,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm: ['', [Validators.required]],
      },
      { validators: this.passwordsMatch }
    );
  }

  // Validación personalizada: las contraseñas deben coincidir
  passwordsMatch(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirm() { return this.registerForm.get('confirm'); }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { name, email, password } = this.registerForm.value;
    this.petService.register(name, email, password);
    const toast = await this.toastCtrl.create({
      message: '¡Cuenta creada! Ya puedes iniciar sesión.',
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    toast.present();
    this.router.navigate(['/login']);
  }
}
