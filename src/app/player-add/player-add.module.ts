import { AuthModule } from 'src/app/shared-modules/auth.module';
import { RouterModule,Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerAddPageRoutingModule } from './player-add-routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PlayerAddPage } from './player-add.page';
const routes: Routes = [
  {
    path: '',
    component: PlayerAddPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // PlayerAddPageRoutingModule,
    RouterModule.forChild(routes),
    AuthModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  declarations: [PlayerAddPage]
})
export class PlayerAddPageModule {}
