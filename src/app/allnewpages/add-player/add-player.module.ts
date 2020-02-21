import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPlayerPageRoutingModule } from './add-player-routing.module';

import { AddPlayerPage } from './add-player.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PlayerAddPage } from 'src/app/player-add/player-add.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPlayerPageRoutingModule,
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
  entryComponents: [],
  declarations: [AddPlayerPage]
})
export class AddPlayerPageModule {}
