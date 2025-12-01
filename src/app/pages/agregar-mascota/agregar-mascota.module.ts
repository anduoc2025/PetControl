import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarMascotaPageRoutingModule } from './agregar-mascota-routing.module';

import { AgregarMascotaPage } from './agregar-mascota.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AgregarMascotaPageRoutingModule
  ],
  declarations: [AgregarMascotaPage]
})
export class AgregarMascotaPageModule {}
