import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTournamentPageRoutingModule } from './view-tournament-routing.module';

import { ViewTournamentPage } from './view-tournament.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewTournamentPageRoutingModule
  ],
  declarations: [ViewTournamentPage]
})
export class ViewTournamentPageModule {}
