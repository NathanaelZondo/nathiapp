import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterpagePageRoutingModule } from './registerpage-routing.module';

import { RegisterpagePage } from './registerpage.page';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from 'src/app/shared-modules/auth.module';
const routes: Routes = [
  {
    path: '',
    component: RegisterpagePage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AuthModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterpagePage]
})
export class RegisterpagePageModule {}
