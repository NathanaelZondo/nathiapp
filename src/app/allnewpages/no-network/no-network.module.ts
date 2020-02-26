import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoNetworkPageRoutingModule } from './no-network-routing.module';

import { NoNetworkPage } from './no-network.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoNetworkPageRoutingModule
  ],
  declarations: [NoNetworkPage]
})
export class NoNetworkPageModule {}
