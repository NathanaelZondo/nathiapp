import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoNetworkPageRoutingModule } from './no-network-routing.module';

import { NoNetworkPage } from './no-network.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoNetworkPageRoutingModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 50,
      outerStrokeWidth: 1,
      innerStrokeWidth: 1,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#F3511D",
      animationDuration: 10,
      showUnits: false,
      toFixed: 0,
      titleColor: '#fff'
    })
  ],
  declarations: [NoNetworkPage]
})
export class NoNetworkPageModule {}
