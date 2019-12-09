import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterpagePage } from './registerpage.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterpagePageRoutingModule {}
