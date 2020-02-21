import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterpagePageRoutingModule } from './registerpage-routing.module';

import { RegisterpagePage } from './registerpage.page';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from 'src/app/shared-modules/auth.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
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
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 2,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#F3511D",
      animationDuration: 300,
    })
  ],
  declarations: [RegisterpagePage]
})
export class RegisterpagePageModule {}
