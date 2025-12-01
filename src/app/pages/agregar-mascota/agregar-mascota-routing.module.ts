import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgregarMascotaPage } from './agregar-mascota.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarMascotaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarMascotaPageRoutingModule {}
